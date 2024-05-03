// src/pages/api/getNearestSea.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

const haversineDistance = (coords1: { lat: number, lon: number }, coords2: { lat: number, lon: number }) => {
    const R = 6371; 
    const dLat = (coords2.lat - coords1.lat) * Math.PI / 180;
    const dLon = (coords2.lon - coords1.lon) * Math.PI / 180;
    const a = 
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(coords1.lat * Math.PI / 180) * Math.cos(coords2.lat * Math.PI / 180) * 
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
}

const getNearestSea = async (req: NextApiRequest, res: NextApiResponse) => {
    const { latitude, longitude } = req.query;

    if (!latitude || !longitude) {
        return res.status(400).json({ error: 'Missing latitude or longitude query parameters' });
    }

    const userCoords = { lat: parseFloat(latitude as string), lon: parseFloat(longitude as string) };
    const url = `http://overpass-api.de/api/interpreter`;
    const data = `
        [out:json][timeout:90];
        (
          node["place"="sea"](around:500000,${latitude},${longitude});
          way["place"="sea"](around:500000,${latitude},${longitude});
          relation["place"="sea"](around:500000,${latitude},${longitude});
        );
        out center;
    `;

    try {
        const response = await axios.post(url, `data=${encodeURIComponent(data)}`, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });
        const results = response.data.elements;
        if (results.length > 0) {
            const seas = results.map((element: any) => ({
                name: element.tags?.name || 'Unnamed Sea',
                latitude: element.center?.lat || element.lat,
                longitude: element.center?.lon || element.lon
            }));

            const nearestSea = seas.reduce((prev: { latitude: any; longitude: any; }, curr: { latitude: any; longitude: any; }) => {
                const distPrev = haversineDistance(userCoords, { lat: prev.latitude, lon: prev.longitude });
                const distCurr = haversineDistance(userCoords, { lat: curr.latitude, lon: curr.longitude });
                return distCurr < distPrev ? curr : prev;
            });
            const distance = haversineDistance(userCoords, { lat: nearestSea.latitude, lon: nearestSea.longitude });

            res.status(200).json({ ...nearestSea, distance: distance.toFixed(2) + ' kms' });
        } else {
            res.status(404).json({ error: 'No sea found nearby' });
        }
    } catch (error) {
        console.error('Error fetching the nearest sea:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

export default getNearestSea;
