// Exact dashboard replication from DashboardModule
// Dashboard state polygon highlight linked with DSS Map
'use client';

import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON, Marker, Popup, LayersControl, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '../styles/leaflet-custom.css';
import { useGeoData } from '../hooks/useGeoData';
import { getClaimMarkerColor, getBoundsForFeature, calculatePolygonArea } from '../utils/mapHelpers';
import type { ClaimData } from '../utils/mapHelpers';
import StateBoundaryLayer from '@/components/layers/StateBoundaryLayer';

// Fix for default marker icons in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface FRACoverageMapProps {
    selectedState?: string;
    selectedDistrict?: string;
    selectedTribe?: string;
    claims: ClaimData[];
    onStatsUpdate?: (stats: any) => void;
    onStateSelect?: (stateName: string) => void;
    onDistrictSelect?: (districtName: string) => void;
}

// Component to handle map bounds updates
function MapBoundsUpdater({ bounds }: { bounds: [[number, number], [number, number]] | null }) {
    const map = useMap();

    useEffect(() => {
        if (bounds) {
            map.fitBounds(bounds, { padding: [50, 50], maxZoom: 10 });
        }
    }, [bounds, map]);

    return null;
}

// Component to integrate StateBoundaryLayer with react-leaflet
// Dashboard → Map State Highlight Fix
function StateBoundaryIntegration({ selectedState }: { selectedState: string | undefined }) {
    const map = useMap();

    // Only show state boundary if a specific state is selected (not "All States")
    const stateToShow = selectedState && selectedState !== 'All States' ? selectedState : null;

    return (
        <StateBoundaryLayer
            map={map}
            selectedState={stateToShow}
            isVisible={!!stateToShow}
        />
    );
}

export default function FRACoverageMap({
    selectedState,
    selectedDistrict,
    selectedTribe,
    claims,
    onStatsUpdate,
    onStateSelect,
    onDistrictSelect
}: FRACoverageMapProps) {
    const mapRef = useRef<L.Map | null>(null);
    const [bounds, setBounds] = useState<[[number, number], [number, number]] | null>(null);
    const [highlightedFeature, setHighlightedFeature] = useState<any>(null);

    // Load GeoJSON for selected state
    const stateCode = selectedState && selectedState !== 'All States'
        ? getStateCode(selectedState)
        : null;
    const { geoData, loading, error } = useGeoData(stateCode || undefined);

    // Filter claims based on selections
    const filteredClaims = claims.filter(claim => {
        if (selectedState && selectedState !== 'All States' && claim.state !== selectedState) {
            return false;
        }
        if (selectedDistrict && selectedDistrict !== 'All Districts' && claim.district !== selectedDistrict) {
            return false;
        }
        if (selectedTribe && selectedTribe !== 'All Tribal Groups' && claim.tribal_group !== selectedTribe) {
            return false;
        }
        return true;
    });

    // Update bounds when GeoJSON loads or district changes
    useEffect(() => {
        if (geoData) {
            if (selectedDistrict && selectedDistrict !== 'All Districts') {
                // Find the specific district feature
                const districtFeature = geoData.features.find((f: any) =>
                    f.properties.DISTRICT === selectedDistrict ||
                    f.properties.district === selectedDistrict ||
                    f.properties.name === selectedDistrict
                );

                if (districtFeature) {
                    const districtBounds = getBoundsForFeature(districtFeature);
                    setBounds(districtBounds);
                    setHighlightedFeature(districtFeature);

                    // Calculate stats for district
                    const area = calculatePolygonArea(districtFeature.geometry);
                    updateStats(area);
                }
            } else {
                // Zoom to entire state
                const stateBounds = getBoundsForFeature(geoData);
                setBounds(stateBounds);
                setHighlightedFeature(null);

                // Calculate stats for state
                const area = calculatePolygonArea(geoData);
                updateStats(area);
            }
        } else if (!selectedState || selectedState === 'All States') {
            // Reset to India view
            setBounds([[6.5, 68], [35.5, 97.5]]);
            setHighlightedFeature(null);
            updateStats(0);
        }
    }, [geoData, selectedDistrict, selectedState]);

    const updateStats = (area: number) => {
        if (onStatsUpdate) {
            const villages = new Set(filteredClaims.map(c => c.village)).size;
            const pattaHolders = filteredClaims.length;

            onStatsUpdate({
                totalArea: area.toFixed(2),
                villages,
                pattaHolders,
                approved: filteredClaims.filter(c => c.status.toLowerCase() === 'approved').length,
                pending: filteredClaims.filter(c => c.status.toLowerCase() === 'pending').length,
                rejected: filteredClaims.filter(c => c.status.toLowerCase() === 'rejected').length,
            });
        }
    };

    // Handler for polygon interactions (click and hover)
    const onEachFeature = (feature: any, layer: L.Layer) => {
        const districtName = feature.properties.DISTRICT || feature.properties.district || feature.properties.name;

        // Add hover tooltip
        if (districtName) {
            layer.bindTooltip(districtName, {
                permanent: false,
                direction: 'center',
                className: 'district-tooltip'
            });
        }

        // Add click handler
        layer.on({
            click: (e: L.LeafletMouseEvent) => {
                L.DomEvent.stopPropagation(e);

                if (selectedDistrict && selectedDistrict !== 'All Districts') {
                    // Already in district view, clicking should select that district
                    if (onDistrictSelect && districtName) {
                        onDistrictSelect(districtName);
                    }
                } else if (selectedState && selectedState !== 'All States') {
                    // In state view, clicking a district should select it
                    if (onDistrictSelect && districtName) {
                        onDistrictSelect(districtName);
                    }
                } else {
                    // In "All States" view, clicking should select the state
                    const stateName = getStateNameFromCode(stateCode || '');
                    if (onStateSelect && stateName) {
                        onStateSelect(stateName);
                    }
                }
            },
            mouseover: (e: L.LeafletMouseEvent) => {
                const layer = e.target;
                layer.setStyle({
                    weight: 4,
                    color: '#0078ff',
                    fillOpacity: 0.5
                });
            },
            mouseout: (e: L.LeafletMouseEvent) => {
                const layer = e.target;
                const isHighlighted = highlightedFeature &&
                    (feature.properties.DISTRICT === highlightedFeature.properties.DISTRICT ||
                        feature.properties.district === highlightedFeature.properties.district ||
                        feature.properties.name === highlightedFeature.properties.name);

                layer.setStyle({
                    fillColor: '#d8e7ff',
                    weight: isHighlighted ? 4 : 2,
                    opacity: 1,
                    color: isHighlighted ? '#0078ff' : '#000000',
                    fillOpacity: 0.4
                });
            }
        });
    };

    // Style for GeoJSON polygons (matching Karnataka example)
    const geoJsonStyle = (feature: any) => {
        const isHighlighted = highlightedFeature &&
            (feature.properties.DISTRICT === highlightedFeature.properties.DISTRICT ||
                feature.properties.district === highlightedFeature.properties.district ||
                feature.properties.name === highlightedFeature.properties.name);

        return {
            fillColor: '#d8e7ff',
            weight: isHighlighted ? 4 : 2,
            opacity: 1,
            color: isHighlighted ? '#0078ff' : '#000000',
            fillOpacity: 0.4
        };
    };

    // Create custom marker icon
    const createMarkerIcon = (status: string) => {
        const color = getClaimMarkerColor(status);
        return L.divIcon({
            className: 'custom-marker-icon',
            html: `<div style="background-color: ${color}; width: 16px; height: 16px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
            iconSize: [16, 16],
            iconAnchor: [8, 8],
        });
    };

    return (
        <div style={{ height: '500px', width: '100%', borderRadius: '12px', overflow: 'hidden' }}>
            <MapContainer
                center={[20.5937, 78.9629]} // Center of India
                zoom={5}
                style={{ height: '100%', width: '100%' }}
                ref={mapRef}
            >
                <LayersControl position="topright">
                    <LayersControl.BaseLayer checked name="OpenStreetMap">
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                    </LayersControl.BaseLayer>
                    <LayersControl.BaseLayer name="Satellite">
                        <TileLayer
                            attribution='&copy; <a href="https://www.esri.com/">Esri</a>'
                            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                        />
                    </LayersControl.BaseLayer>
                </LayersControl>

                {/* Render GeoJSON for selected state */}
                {geoData && !loading && (
                    <GeoJSON
                        key={`${selectedState}-${selectedDistrict}`}
                        data={geoData}
                        style={geoJsonStyle}
                        onEachFeature={onEachFeature}
                    />
                )}

                {/* Render claim markers */}
                {filteredClaims.map((claim) => (
                    <Marker
                        key={claim.claim_id}
                        position={[claim.latitude, claim.longitude]}
                        icon={createMarkerIcon(claim.status)}
                    >
                        <Popup>
                            <div style={{ minWidth: '200px' }}>
                                <div className="claim-popup-title">{claim.claim_id}</div>
                                <div className="claim-popup-row">
                                    <span className="claim-popup-label">Holder:</span>
                                    <span className="claim-popup-value">{claim.holder_or_community}</span>
                                </div>
                                <div className="claim-popup-row">
                                    <span className="claim-popup-label">Tribe:</span>
                                    <span className="claim-popup-value">{claim.tribal_group}</span>
                                </div>
                                <div className="claim-popup-row">
                                    <span className="claim-popup-label">Type:</span>
                                    <span className="claim-popup-value">{claim.claim_type}</span>
                                </div>
                                <div className="claim-popup-row">
                                    <span className="claim-popup-label">Status:</span>
                                    <span className={`claim-status-badge claim-status-${claim.status.toLowerCase()}`}>
                                        {claim.status}
                                    </span>
                                </div>
                                <div className="claim-popup-row">
                                    <span className="claim-popup-label">Area:</span>
                                    <span className="claim-popup-value">{claim.area_acres} acres</span>
                                </div>
                                <div className="claim-popup-row">
                                    <span className="claim-popup-label">Village:</span>
                                    <span className="claim-popup-value">{claim.village}</span>
                                </div>
                                <div className="claim-popup-row">
                                    <span className="claim-popup-label">District:</span>
                                    <span className="claim-popup-value">{claim.district}</span>
                                </div>
                                <div className="claim-popup-row">
                                    <span className="claim-popup-label">State:</span>
                                    <span className="claim-popup-value">{claim.state}</span>
                                </div>
                            </div>
                        </Popup>
                    </Marker>
                ))}

                {/* State Boundary Layer - reuses DSS polygon logic */}
                <StateBoundaryIntegration selectedState={selectedState} />

                {/* Update map bounds */}
                <MapBoundsUpdater bounds={bounds} />
            </MapContainer>

            {loading && (
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    background: 'white',
                    padding: '20px',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                }}>
                    Loading map data...
                </div>
            )}

            {error && (
                <div style={{
                    position: 'absolute',
                    top: '10px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: '#fee2e2',
                    color: '#991b1b',
                    padding: '10px 20px',
                    borderRadius: '8px',
                    fontSize: '14px'
                }}>
                    Error loading map: {error}
                </div>
            )}
        </div>
    );
}

// Helper function to get state code from state name
function getStateCode(stateName: string): string {
    const mapping: { [key: string]: string } = {
        'Telangana': 'India_District_36_TG',
        'Odisha': 'India_District_21_OR',
        'Madhya Pradesh': 'India_District_23_MP',
        'Tripura': 'India_District_16_TR',
    };
    return mapping[stateName] || '';
}

// Helper function to get state name from code (reverse mapping)
function getStateNameFromCode(code: string): string {
    const reverseMapping: { [key: string]: string } = {
        'India_District_36_TG': 'Telangana',
        'India_District_21_OR': 'Odisha',
        'India_District_23_MP': 'Madhya Pradesh',
        'India_District_16_TR': 'Tripura',
    };
    return reverseMapping[code] || '';
}
