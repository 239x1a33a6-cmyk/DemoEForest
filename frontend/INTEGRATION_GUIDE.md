# StateBoundaryLayer - Integration Guide

## Overview

`StateBoundaryLayer` is a React component that adds state boundary polygons to your **existing** Leaflet map. It does NOT create a new map or page - it simply adds a layer on top of your current DSS map.

## ✅ What It Does

- ✅ Loads GeoJSON from `/data/Indian_States.json`
- ✅ Filters by `properties.NAME_1` (state name)
- ✅ Adds state boundary polygon to your existing map
- ✅ Smooth zoom animation with `map.flyToBounds()`
- ✅ Hover effects (opacity 0.4 → 0.7)
- ✅ Click popup showing lat & lon
- ✅ Automatic cleanup when state changes

## ❌ What It Does NOT Do

- ❌ Does NOT create a new map container
- ❌ Does NOT create a new page
- ❌ Does NOT modify your existing map structure
- ❌ Does NOT remove base layers
- ❌ Does NOT reset the map
- ❌ Does NOT change your UI

## 🔧 Integration with Existing DSS Map

### Step 1: Import the Component

In your existing DSS map component (e.g., `SpatialMap.tsx` or wherever you use the map):

```tsx
import StateBoundaryLayer from '@/components/layers/StateBoundaryLayer';
```

### Step 2: Add State Selection

Add a state to your component state (if not already present):

```tsx
const [selectedState, setSelectedState] = useState<string | null>(null);
```

### Step 3: Render the Layer Component

Add the `StateBoundaryLayer` component inside your map component:

```tsx
export default function SpatialMap({ villages, filters, onVillageSelect }: SpatialMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const [selectedState, setSelectedState] = useState<string | null>(null);

  // ... existing map initialization code ...

  return (
    <div className="relative">
      <div ref={mapContainerRef} className="w-full h-[600px]" />
      
      {/* Add this line - it will render the state boundary on your existing map */}
      <StateBoundaryLayer 
        map={mapRef.current}           // Pass your existing map instance
        selectedState={selectedState}   // Pass the selected state name
        isVisible={true}                // Optional: control visibility
      />
    </div>
  );
}
```

### Step 4: Add State Selector (Optional)

If you want a dropdown to select states, add this to your UI:

```tsx
<select 
  value={selectedState || ''} 
  onChange={(e) => setSelectedState(e.target.value)}
>
  <option value="">-- Select State --</option>
  <option value="Telangana">Telangana</option>
  <option value="Madhya Pradesh">Madhya Pradesh</option>
  <option value="Jharkhand">Jharkhand</option>
  <option value="Tripura">Tripura</option>
</select>
```

## 📋 Complete Example

Here's a complete example showing how to integrate with your existing DSS map:

```tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { VillageData, MapFilters } from '@/types/dss';
import StateBoundaryLayer from '@/components/layers/StateBoundaryLayer';

interface SpatialMapProps {
  villages: VillageData[];
  filters: MapFilters;
  onVillageSelect: (village: VillageData) => void;
}

export default function SpatialMap({ villages, filters, onVillageSelect }: SpatialMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [selectedState, setSelectedState] = useState<string | null>(null);

  // Initialize map (your existing code)
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current).setView([17.5551, 80.6245], 8);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 18,
    }).addTo(map);

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // ... rest of your existing map logic ...

  return (
    <div className="relative">
      {/* State Selector */}
      <div className="absolute top-4 left-4 z-[1000] bg-white p-3 rounded shadow">
        <label className="block text-sm font-medium mb-2">Select State:</label>
        <select 
          value={selectedState || ''} 
          onChange={(e) => setSelectedState(e.target.value)}
          className="px-3 py-2 border rounded"
        >
          <option value="">-- None --</option>
          <option value="Telangana">Telangana</option>
          <option value="Madhya Pradesh">Madhya Pradesh</option>
          <option value="Jharkhand">Jharkhand</option>
          <option value="Tripura">Tripura</option>
        </select>
      </div>

      {/* Map Container (your existing map) */}
      <div ref={mapContainerRef} className="w-full h-[600px]" />

      {/* State Boundary Layer - adds to existing map */}
      <StateBoundaryLayer 
        map={mapRef.current}
        selectedState={selectedState}
        isVisible={true}
      />
    </div>
  );
}
```

## 🎨 Styling

The component uses these styles:

```javascript
{
  color: '#000000',        // Border: black
  weight: 2,               // Border: 2px
  fillColor: stateColor,   // Fill: state-specific color
  fillOpacity: 0.4         // Fill opacity: 0.4 (normal)
}

// On hover:
{
  fillOpacity: 0.7         // Increased opacity
}
```

### State Colors

| State | Color | Hex |
|-------|-------|-----|
| Telangana | Red-Orange | `#FF5733` |
| Madhya Pradesh | Dodger Blue | `#1E90FF` |
| Jharkhand | Green | `#28A745` |
| Tripura | Purple | `#9B59B6` |

## 🔄 Behavior

### When State is Selected

1. **Previous layer removed**: If a state boundary already exists, it's removed first
2. **GeoJSON loaded**: Fetches `/data/Indian_States.json`
3. **State filtered**: Finds feature where `properties.NAME_1 === selectedState`
4. **Layer added**: `stateLayer.addTo(map)` - adds to your existing map
5. **Smooth zoom**: `map.flyToBounds(bounds, { duration: 1.5 })`

### When State is Deselected (null)

- State boundary layer is removed
- Map returns to previous view (no automatic zoom out)

### Hover

- Mouse over state → opacity increases to 0.7
- Mouse out → opacity returns to 0.4

### Click

- Click on state boundary → popup appears
- Popup shows: State name, Latitude, Longitude

## 🐛 Troubleshooting

### State boundary not appearing

1. Check console for errors
2. Verify `/data/Indian_States.json` exists
3. Ensure state name matches exactly (case-sensitive)
4. Confirm map instance is passed correctly

### Zoom not working

- Ensure map instance is not null
- Check that GeoJSON has valid coordinates
- Verify `flyToBounds` is not being overridden

### Multiple boundaries showing

- Check that previous layer is being removed
- Ensure only one `StateBoundaryLayer` component is rendered

## 📝 Props API

```typescript
interface StateBoundaryLayerProps {
  map: L.Map | null;           // Required: Your existing Leaflet map instance
  selectedState: string | null; // Required: State name (e.g., "Telangana") or null
  isVisible?: boolean;          // Optional: Show/hide layer (default: true)
}
```

## 🎯 Key Points

1. **No new map**: Uses your existing `mapRef.current`
2. **No new page**: Renders as a child component
3. **No UI changes**: Doesn't modify your existing UI
4. **Automatic cleanup**: Removes layer when state changes or component unmounts
5. **Smooth integration**: Works seamlessly with your existing layers

## 📦 Dependencies

- `leaflet` (already installed)
- `react` (already installed)
- GeoJSON file at `/data/Indian_States.json` (already copied)

## ✨ That's It!

Just add the component to your existing map, pass the map instance and selected state, and it will handle everything else automatically.
