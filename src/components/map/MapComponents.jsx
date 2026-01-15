import { useEffect } from 'react';
import { useMap } from 'react-leaflet';

// --- COORDINATES (Approximate Centers for Demo) ---
export const REGION_COORDINATES = {
    'NCR': [14.5995, 120.9842],
    'CAR': [17.4105, 120.9856],
    'R1': [16.6023, 120.3175], // Ilocos
    'R2': [17.6133, 121.7270], // Cagayan Valley
    'R3': [15.4828, 120.7120], // Central Luzon
    'R4A': [14.1008, 121.0794], // Calabarzon
    'R4B': [13.2356, 121.2334], // Mimaropa
    'R5': [13.4210, 123.4132], // Bicol
    'R6': [11.0050, 122.5373], // Western Visayas
    'R7': [9.8169, 124.0641], // Central Visayas
    'R8': [11.2443, 125.0033], // Eastern Visayas
    'R9': [7.8361, 122.3857], // Zamboanga
    'R10': [8.2392, 124.2448], // Northern Mindanao
    'R11': [7.1907, 125.4553], // Davao
    'R12': [6.5074, 124.8398], // Soccsksargen
    'R13': [8.8354, 125.4190], // Caraga
    'BARMM': [7.2289, 124.2384],
    'CO': [14.5995, 121.0542], // DOST Central Bicutan
    'R1.1': [16.6158, 120.3209], // La Union specific
};

export const PH_CENTER = [12.8797, 121.7740]; // Center of PH
export const DEFAULT_ZOOM = 6;

// --- COMPONENT: Auto Recenter Map ---
export const RecenterAutomatically = ({ lat, lng, zoom = 10 }) => {
    const map = useMap();
    useEffect(() => {
        if (lat && lng) {
            map.flyTo([lat, lng], zoom, {
                animate: true,
                duration: 1.5 // Cinematic float
            });
        }
    }, [lat, lng, zoom, map]);
    return null;
};
