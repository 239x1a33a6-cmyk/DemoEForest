'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';

/**
 * Props for StateBoundaryLayer component
 * 
 * ⚠️ IMPORTANT: This layer is controlled ONLY by the DSS state dropdown.
 * Layer checkboxes in the base map should NOT affect this layer.
 */
interface StateBoundaryLayerProps {
    map: L.Map | null; // Existing Leaflet Map instance from DSS
    selectedState: string | null; // State name to display (e.g., "Andhra Pradesh", "Madhya Pradesh")
    isVisible?: boolean; // Optional: Whether the layer should be visible (default: true)
}

/**
 * State color mapping
 */
const STATE_COLORS: Record<string, string> = {
    'Andhra Pradesh': '#FF5733',
    'Telangana': '#FF5733',
    'Madhya Pradesh': '#1E90FF',
    'Jharkhand': '#28A745',
    'Tripura': '#9B59B6',
    'Chhattisgarh': '#FF6B35',
    'Odisha': '#4ECDC4'  // Odisha
};

/**
 * StateBoundaryLayer Component
 * 
 * Adds state boundary polygons to an existing Leaflet map.
 * Loads GeoJSON from local file, filters by state name, and renders with custom styling.
 * 
 * Features:
 * - Loads from /data/Indian_States.json
 * - Filters by properties.NAME_1
 * - Custom colors per state
 * - Smooth zoom animation
 * - Hover effects
 * - Click popup with coordinates
 * 
 * @example
 * <StateBoundaryLayer 
 *   map={mapRef.current} 
 *   selectedState="Telangana" 
 *   isVisible={true}
 * />
 */
export default function StateBoundaryLayer({
    map,
    selectedState,
    isVisible = true
}: StateBoundaryLayerProps) {
    // Reference to the current state boundary layer
    const stateLayerRef = useRef<L.GeoJSON | null>(null);

    useEffect(() => {
        console.log("StateBoundaryLayer effect triggered", { map: !!map, selectedState, isVisible });
        // Early return if map is not ready
        if (!map) {
            return;
        }

        // Remove existing state layer if it exists
        if (stateLayerRef.current) {
            map.removeLayer(stateLayerRef.current);
            stateLayerRef.current = null;
        }

        // Early return if layer should not be visible or no state is selected
        if (!isVisible || !selectedState) {
            return;
        }

        /**
         * Load and display state boundary
         */
        const loadStateBoundary = async () => {
            try {
                // Fetch the GeoJSON data from public directory
                // Using new dataset which is organized by state files containing districts
                const response = await fetch(`/data/new_districts/${selectedState}.json`);

                if (!response.ok) {
                    throw new Error(`Failed to load GeoJSON: ${response.statusText}`);
                }

                const geojsonData = await response.json();

                // Get state color (default to gray if not defined)
                const fillColor = STATE_COLORS[selectedState] || '#808080';

                // Create GeoJSON layer with styling
                // Since the file contains all districts, we render them all to form the state
                const stateLayer = L.geoJSON(geojsonData, {
                    style: () => ({
                        color: '#000000',      // Border color: black
                        weight: 1,             // Border weight: 1px (thinner for districts)
                        fillColor: fillColor,  // Fill color: state-specific
                        fillOpacity: 0.4       // Fill opacity: 0.4
                    }),

                    // Add interactivity to each feature
                    onEachFeature: (feature, layer) => {
                        // Store original style for hover reset
                        const originalStyle = {
                            fillOpacity: 0.4,
                            weight: 1
                        };

                        // Hover effect - increase opacity on mouseover
                        layer.on('mouseover', function (this: L.Path) {
                            this.setStyle({
                                fillOpacity: 0.7,
                                weight: 2
                            });
                        });

                        // Hover effect - reset on mouseout
                        layer.on('mouseout', function (this: L.Path) {
                            this.setStyle(originalStyle);
                        });

                        // Click event - show popup with coordinates
                        layer.on('click', (e: L.LeafletMouseEvent) => {
                            const { lat, lng } = e.latlng;
                            // Try to get district name if available, otherwise just state
                            const districtName = feature.properties.dtname || feature.properties.DISTRICT || '';

                            // Create popup content with lat & lon
                            const popupContent = `
                <div style="padding: 8px; min-width: 180px;">
                  <h3 style="margin: 0 0 8px 0; font-weight: bold; font-size: 14px;">${selectedState}</h3>
                  ${districtName ? `<p style="margin: 0 0 4px 0; font-size: 12px; font-weight: bold;">${districtName}</p>` : ''}
                  <div style="font-size: 12px; color: #666;">
                    <p style="margin: 4px 0;"><strong>Latitude:</strong> ${lat.toFixed(4)}°</p>
                    <p style="margin: 4px 0;"><strong>Longitude:</strong> ${lng.toFixed(4)}°</p>
                  </div>
                </div>
              `;

                            // Bind and open popup
                            layer.bindPopup(popupContent).openPopup();
                        });
                    }
                });

                // Add layer to the existing map
                stateLayer.addTo(map);
                stateLayerRef.current = stateLayer;

                // Smooth zoom to state bounds with animation
                const bounds = stateLayer.getBounds();
                if (bounds.isValid()) {
                    map.flyToBounds(bounds, {
                        duration: 1.5,      // Animation duration: 1.5 seconds
                        padding: [50, 50],  // Padding around bounds
                        maxZoom: 8          // Don't zoom in too much
                    });
                }

            } catch (error) {
                console.error('Error loading state boundary:', error);

                // Show error notification to user (optional)
                if (map) {
                    const errorPopup = L.popup()
                        .setLatLng(map.getCenter())
                        .setContent(`
              <div style="padding: 8px; background: #fee; border: 1px solid #fcc; border-radius: 4px;">
                <p style="margin: 0; font-size: 12px; color: #c00; font-weight: bold;">Failed to load state boundary</p>
                <p style="margin: 4px 0 0 0; font-size: 11px; color: #900;">Please check console for details</p>
              </div>
            `)
                        .openOn(map);
                }
            }
        };

        // Load the boundary
        loadStateBoundary();

        // Cleanup function - remove layer when component unmounts or dependencies change
        return () => {
            if (stateLayerRef.current && map) {
                map.removeLayer(stateLayerRef.current);
                stateLayerRef.current = null;
            }
        };
    }, [map, selectedState, isVisible]);

    // This component doesn't render any DOM elements
    return null;
}
