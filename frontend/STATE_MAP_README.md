# E-Forest DSS WebGIS - State Boundary Visualization

## 🎯 Overview

This implementation provides a comprehensive WebGIS solution for visualizing Indian state boundaries, vulnerability heatmaps, and FRA (Forest Rights Act) Patta locations using Leaflet.

## ✨ Features Implemented

### 1️⃣ **State Boundary Display**
- ✅ Loads GeoJSON from local file (`/data/Indian_States.json`)
- ✅ Filters by state name (`NAME_1` property)
- ✅ Custom colors for each state:
  - **Telangana**: `#FF5733` (Red-Orange)
  - **Madhya Pradesh**: `#1E90FF` (Dodger Blue)
  - **Jharkhand**: `#28A745` (Green)
  - **Tripura**: `#9B59B6` (Purple)
- ✅ Border styling: Black (`#000000`), 2px weight
- ✅ Fill opacity: 0.4
- ✅ Smooth zoom animation with `flyToBounds` (1.5s duration)
- ✅ Hover effects (thicker border + increased opacity)
- ✅ Click popup showing: State Name, Coordinates, Districts, FRA Holders, Priority Villages

### 2️⃣ **Vulnerability Heatmap Layer**
- ✅ Color-coded vulnerability scores:
  - 🔴 **Red** (75-100): High Risk
  - 🟡 **Yellow** (50-74): Medium Risk
  - 🟢 **Green** (0-49): Low Risk
- ✅ Circle markers scaled by vulnerability score
- ✅ Interactive popups with detailed information

### 3️⃣ **FRA Patta Layer**
- ✅ Custom markers for:
  - 🔵 **IFR** (Individual Forest Rights) - Blue marker with "I"
  - 🟢 **CFR** (Community Forest Rights) - Green marker with "C"
- ✅ Popups showing: Patta holder name, Village, Land area, Claim type, Coordinates

### 4️⃣ **Information Panel**
- ✅ Auto-updates on state selection
- ✅ Displays:
  - State name
  - Number of districts
  - FRA Patta holders count
  - Priority villages (High Risk)
- ✅ Loading state indicator

### 5️⃣ **Legend**
- ✅ State boundary color indicator
- ✅ Vulnerability scale (Low/Medium/High)
- ✅ FRA marker types (IFR/CFR)

### 6️⃣ **Layer Control**
- ✅ Toggle layers on/off:
  - State Boundary
  - Vulnerability Heatmap
  - FRA Pattas
- ✅ Interactive checkboxes with icons

### 7️⃣ **Loading & Error Handling**
- ✅ Loading spinner during data fetch
- ✅ Error alerts for missing files
- ✅ Graceful fallbacks

## 📁 Files Created/Modified

### Core Components
- `components/layers/StateBoundaryLayer.tsx` - State boundary rendering with Leaflet
- `components/layers/HeatmapLayer.tsx` - Vulnerability heatmap visualization
- `components/layers/FRALayer.tsx` - FRA Patta marker layer

### UI Components
- `components/dss/MapLegend.tsx` - Map legend display
- `components/dss/LayerControl.tsx` - Layer toggle controls
- `components/dss/InfoPanel.tsx` - State information panel

### Data & Utilities
- `lib/stateMetadata.ts` - State metadata (colors, counts, coordinates)
- `public/data/Indian_States.json` - GeoJSON state boundaries (13MB)

### Demo Page
- `app/state-map-demo/page.tsx` - Complete demo showcasing all features

## 🚀 Usage

### Access the Demo

Navigate to: **`http://localhost:3000/state-map-demo`**

### Select a State

Use the dropdown in the header to select:
- Telangana
- Madhya Pradesh
- Jharkhand
- Tripura

### Interact with the Map

1. **Zoom**: The map automatically zooms to the selected state with smooth animation
2. **Hover**: Hover over state boundary to see highlight effect
3. **Click**: Click on state to see detailed popup
4. **Layers**: Toggle layers on/off using the Layer Control panel
5. **Heatmap**: Click on vulnerability circles to see risk scores
6. **FRA Markers**: Click on markers to see patta holder details

## 🔧 Component API

### StateBoundaryLayer

```tsx
<StateBoundaryLayer 
  map={mapInstance}           // Leaflet Map instance
  selectedState="Telangana"   // State name to display
  isVisible={true}            // Show/hide layer
  onStateClick={(name, lat, lng) => {}}  // Optional callback
/>
```

### HeatmapLayer

```tsx
<HeatmapLayer 
  map={mapInstance}
  selectedState="Telangana"
  isVisible={true}
/>
```

### FRALayer

```tsx
<FRALayer 
  map={mapInstance}
  selectedState="Telangana"
  isVisible={true}
/>
```

### InfoPanel

```tsx
<InfoPanel 
  selectedState="Telangana"
  isLoading={false}
/>
```

### LayerControl

```tsx
<LayerControl 
  onLayerToggle={(layerId, enabled) => {}}
  initialLayers={{ 'state-boundary': true, 'heatmap': true }}
/>
```

### MapLegend

```tsx
<MapLegend selectedState="Telangana" />
```

## 📊 Data Structure

### State Metadata

```typescript
{
  name: 'Telangana',
  fullName: 'Telangana',
  color: '#FF5733',
  districtCount: 33,
  fraHolders: 12500,
  priorityVillages: 12,
  center: [18.1124, 79.0193]
}
```

### GeoJSON Structure

```json
{
  "type": "FeatureCollection",
  "features": [{
    "type": "Feature",
    "properties": {
      "NAME_0": "India",
      "NAME_1": "Telangana",
      "ID_1": 1,
      ...
    },
    "geometry": {
      "type": "MultiPolygon",
      "coordinates": [...]
    }
  }]
}
```

## ⚠️ Important Notes

### District Data Not Available
The `Indian_States.json` file contains **only state-level boundaries** (`NAME_1`). It does **NOT** include district-level data (`NAME_2`). The "District Boundary Overlay" feature was skipped due to this limitation.

If you need district boundaries, you'll need to provide a separate district-level GeoJSON file.

### CRS (Coordinate Reference System)
The implementation uses **EPSG:4326** (WGS 84) which is the standard for Leaflet and matches the GeoJSON data.

### Performance
The GeoJSON file is 13MB. Loading is optimized by:
- Fetching only once per session
- Filtering features client-side
- Using Leaflet's efficient rendering

## 🎨 Styling

All components use Tailwind CSS for consistent styling. Colors are defined in:
- State metadata: `lib/stateMetadata.ts`
- Vulnerability colors: Hardcoded in `HeatmapLayer.tsx`
- FRA marker colors: Hardcoded in `FRALayer.tsx`

## 🐛 Troubleshooting

### Map Not Loading
- Check browser console for errors
- Verify `/data/Indian_States.json` exists
- Ensure Leaflet CSS is imported

### State Not Displaying
- Verify state name matches exactly (case-sensitive)
- Check GeoJSON has feature with matching `NAME_1`
- Look for console warnings

### Layers Not Toggling
- Ensure `LayerControl` callback is connected
- Check `isVisible` prop is being updated
- Verify layer refs are being cleaned up

## 🔄 Next Steps

To extend this implementation:

1. **Add District Data**: Provide district-level GeoJSON and update components
2. **Real-time Data**: Connect to backend API for live FRA/vulnerability data
3. **Export Features**: Add map export (PNG/PDF) functionality
4. **Advanced Filters**: Add date range, claim status filters
5. **Analytics Dashboard**: Integrate charts and statistics

## 📝 License

Part of the E-Forest DSS project.
