// Export utilities for FRA Atlas

import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';
import { ExportFormat, ExportOptions } from '@/types/atlas';

// Capture screenshot of map
export async function captureMapScreenshot(
    elementId: string,
    filename: string = 'fra-atlas-map',
    format: 'png' | 'jpg' = 'png',
    quality: number = 0.95
): Promise<void> {
    const element = document.getElementById(elementId);
    if (!element) {
        throw new Error(`Element with id "${elementId}" not found`);
    }

    try {
        const canvas = await html2canvas(element, {
            useCORS: true,
            allowTaint: true,
            backgroundColor: '#ffffff',
            scale: 2, // Higher quality
        });

        canvas.toBlob(
            (blob) => {
                if (blob) {
                    saveAs(blob, `${filename}.${format}`);
                }
            },
            `image/${format}`,
            quality
        );
    } catch (error) {
        console.error('Error capturing screenshot:', error);
        throw error;
    }
}

// Export data as JSON
export function exportAsJSON(data: any, filename: string = 'fra-atlas-data'): void {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    saveAs(blob, `${filename}.json`);
}

// Export data as CSV
export function exportAsCSV(data: any[], filename: string = 'fra-atlas-data'): void {
    if (data.length === 0) {
        throw new Error('No data to export');
    }

    // Get headers from first object
    const headers = Object.keys(data[0]);
    const csvRows = [];

    // Add header row
    csvRows.push(headers.join(','));

    // Add data rows
    for (const row of data) {
        const values = headers.map(header => {
            const value = row[header];
            // Escape commas and quotes
            const escaped = String(value).replace(/"/g, '""');
            return `"${escaped}"`;
        });
        csvRows.push(values.join(','));
    }

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `${filename}.csv`);
}

// Export data as Excel (using CSV format for simplicity)
export function exportAsExcel(data: any[], filename: string = 'fra-atlas-data'): void {
    exportAsCSV(data, filename);
}

// Export GeoJSON
export function exportAsGeoJSON(geoJsonData: any, filename: string = 'fra-atlas-layers'): void {
    const jsonString = JSON.stringify(geoJsonData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/geo+json' });
    saveAs(blob, `${filename}.geojson`);
}

// Export as KML (simplified version)
export function exportAsKML(geoJsonData: any, filename: string = 'fra-atlas-layers'): void {
    let kml = `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Document>
    <name>FRA Atlas Export</name>
    <description>Forest Rights Act data exported from FRA Atlas</description>
`;

    // Convert GeoJSON features to KML placemarks
    if (geoJsonData.features) {
        geoJsonData.features.forEach((feature: any, index: number) => {
            const props = feature.properties || {};
            const geom = feature.geometry;

            kml += `    <Placemark>
      <name>${props.name || `Feature ${index + 1}`}</name>
      <description>${JSON.stringify(props)}</description>
`;

            if (geom.type === 'Point') {
                const [lng, lat] = geom.coordinates;
                kml += `      <Point>
        <coordinates>${lng},${lat},0</coordinates>
      </Point>
`;
            } else if (geom.type === 'Polygon') {
                kml += `      <Polygon>
        <outerBoundaryIs>
          <LinearRing>
            <coordinates>
`;
                geom.coordinates[0].forEach(([lng, lat]: number[]) => {
                    kml += `              ${lng},${lat},0\n`;
                });
                kml += `            </coordinates>
          </LinearRing>
        </outerBoundaryIs>
      </Polygon>
`;
            }

            kml += `    </Placemark>
`;
        });
    }

    kml += `  </Document>
</kml>`;

    const blob = new Blob([kml], { type: 'application/vnd.google-earth.kml+xml' });
    saveAs(blob, `${filename}.kml`);
}

// Generate PDF report using jsPDF
export async function exportAsPDF(elementId: string, filename: string = 'fra-atlas-report'): Promise<void> {
    const element = document.getElementById(elementId);
    if (!element) {
        throw new Error(`Element with id "${elementId}" not found`);
    }

    try {
        // Dynamically import jsPDF to avoid server-side issues
        const { jsPDF } = await import('jspdf');

        const canvas = await html2canvas(element, {
            useCORS: true,
            allowTaint: true,
            backgroundColor: '#ffffff',
            scale: 2, // Higher quality
        });

        const imgData = canvas.toDataURL('image/png');

        // A4 dimensions in mm
        const pdfWidth = 297; // Landscape
        const pdfHeight = 210;

        const pdf = new jsPDF({
            orientation: 'landscape',
            unit: 'mm',
            format: 'a4'
        });

        const imgProps = pdf.getImageProperties(imgData);
        const pdfRatio = pdfWidth / pdfHeight;
        const imgRatio = imgProps.width / imgProps.height;

        let renderWidth = pdfWidth;
        let renderHeight = pdfHeight;

        // Fit image to page
        if (imgRatio > pdfRatio) {
            renderHeight = pdfWidth / imgRatio;
        } else {
            renderWidth = pdfHeight * imgRatio;
        }

        // Center image
        const x = (pdfWidth - renderWidth) / 2;
        const y = (pdfHeight - renderHeight) / 2;

        pdf.addImage(imgData, 'PNG', x, y, renderWidth, renderHeight);

        // Add title and metadata
        pdf.setFontSize(16);
        pdf.text('FRA Atlas Report', 10, 10);
        pdf.setFontSize(10);
        pdf.text(`Generated on: ${new Date().toLocaleString()}`, 10, 16);

        pdf.save(`${filename}.pdf`);
    } catch (error) {
        console.error('Error generating PDF:', error);
        throw error;
    }
}

// Main export function that handles all formats
export async function exportData(
    format: ExportFormat,
    data: any,
    options: ExportOptions = {
        format: 'geojson',
        includeFilters: true,
        includeLegend: true,
        includeMetadata: true,
    }
): Promise<void> {
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `fra-atlas-export-${timestamp}`;

    try {
        switch (format) {
            case 'png':
            case 'jpg':
                await captureMapScreenshot('atlas-map-container', filename, format, options.quality || 0.95);
                break;
            case 'pdf':
                await exportAsPDF('atlas-map-container', filename);
                break;
            case 'excel':
            case 'csv':
                exportAsCSV(data, filename);
                break;
            case 'geojson':
                exportAsGeoJSON(data, filename);
                break;
            case 'shapefile':
                // Shapefile export would require a server-side conversion
                // For now, export as GeoJSON
                exportAsGeoJSON(data, filename);
                console.warn('Shapefile export not fully implemented. Exporting as GeoJSON instead.');
                break;
            default:
                exportAsJSON(data, filename);
        }
    } catch (error) {
        console.error(`Error exporting as ${format}:`, error);
        throw error;
    }
}

// Generate export metadata
export function generateExportMetadata(filters: any, layers: any[]): any {
    return {
        exportDate: new Date().toISOString(),
        exportedBy: 'FRA Atlas',
        version: '1.0.0',
        filters: filters,
        visibleLayers: layers.filter(l => l.visible).map(l => l.name),
        attribution: 'Ministry of Tribal Affairs, Government of India',
        dataSource: 'Forest Rights Act Implementation Data',
    };
}
