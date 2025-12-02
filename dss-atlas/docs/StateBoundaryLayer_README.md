# StateBoundaryLayer Component

## Overview
The `StateBoundaryLayer` component is responsible for rendering state boundaries on the Google Map using GeoJSON data. It provides interactive features such as hover effects, click-to-zoom, and a metadata popup.

## Features
- **Dynamic GeoJSON Loading**: Fetches state boundary data from local GeoJSON files located in `/public/atlas_data/state_boundaries/`.
- **Metadata Integration**: Fetches state-specific metadata (Area, FRA Holders, District Count) from the `/api/states/[state]/metadata` endpoint.
- **Interactive Styling**:
  - **Default**: Blue outline (`#0057B7`), transparent fill.
  - **Hover**: Thicker blue outline.
  - **Selected**: Zooms map to the state's extent.
- **Popup**: Displays state name and metadata on click.

## Usage

```tsx
import StateBoundaryLayer from '@/components/layers/StateBoundaryLayer';

<StateBoundaryLayer 
  map={mapInstance} 
  state={selectedStateCode} 
  isVisible={showLayer} 
/>
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `map` | `google.maps.Map` | The Google Maps instance to render the layer on. |
| `state` | `string` | The state code (e.g., 'jh', 'mp') to load data for. |
| `isVisible` | `boolean` | Controls the visibility of the layer. |

## Data Sources
1. **GeoJSON**: `/public/atlas_data/state_boundaries/{StateName}.geojson`
   - The component maps state codes (e.g., 'jh') to full state names (e.g., 'Jharkhand') to construct the file path.
2. **Metadata API**: `/api/states/{state_code}/metadata`
   - Returns JSON: `{ state_name, area_sqkm, fra_holders, district_count }`

## Dependencies
- `google.maps` API (via `window.google`)
- `axios` for API requests

## Notes
- Ensure the GeoJSON files are valid and contain a `FeatureCollection` or `Feature` with `Polygon` or `MultiPolygon` geometry.
- The component handles map fitting to bounds automatically when data is loaded.
