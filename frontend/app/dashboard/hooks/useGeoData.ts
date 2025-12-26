// Exact dashboard replication from DashboardModule
import { useState, useEffect } from 'react';

interface GeoDataCache {
    [key: string]: any;
}

const cache: GeoDataCache = {};

export function useGeoData(stateCode?: string) {
    const [geoData, setGeoData] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!stateCode) {
            setGeoData(null);
            return;
        }

        // Check cache first
        if (cache[stateCode]) {
            setGeoData(cache[stateCode]);
            return;
        }

        setLoading(true);
        setError(null);

        const fileName = `${stateCode}.geojson`;
        const filePath = `/geojson/states/${fileName}`;

        fetch(filePath)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to load ${fileName}`);
                }
                return response.json();
            })
            .then(data => {
                cache[stateCode] = data;
                setGeoData(data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error loading GeoJSON:', err);
                setError(err.message);
                setLoading(false);
            });
    }, [stateCode]);

    return { geoData, loading, error };
}

export function useClaimsData() {
    const [claims, setClaims] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetch('/fra_demo_claims.csv')
            .then(response => response.text())
            .then(csvText => {
                const lines = csvText.trim().split('\n');
                const headers = lines[0].split(',');

                const parsed = lines.slice(1).map(line => {
                    const values = line.split(',');
                    const obj: any = {};
                    headers.forEach((header, index) => {
                        const value = values[index];
                        // Convert numeric fields
                        if (header === 'area_acres' || header === 'latitude' || header === 'longitude') {
                            obj[header] = parseFloat(value);
                        } else {
                            obj[header] = value;
                        }
                    });
                    return obj;
                });

                setClaims(parsed);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error loading claims:', err);
                setError(err.message);
                setLoading(false);
            });
    }, []);

    return { claims, loading, error };
}
