
// src/pages/api/getNearestSea.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

const getNearestSea = async (req: NextApiRequest, res: NextApiResponse) => {
    const { latitude, longitude } = req.query;

    if (!latitude || !longitude) {
        return res.status(400).json({ error: 'Missing latitude or longitude query parameters' });
    }

    const apiKey = 'AIzaSyAa6rmGkc5Ri3GDrlFskD-x7kp-2lGGi84';
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json`;
    const params = {
        location: `${latitude},${longitude}`,
        radius: '1000000',
        type: 'water',
        keyword: 'sea',
        key: apiKey,
    };

    try {
        const response = await axios.get(url, { params });
        const results = response.data.results;
        if (results.length > 0) {
            res.status(200).json(results[0]);
        } else {
            res.status(404).json({ error: 'No sea found nearby' });
        }
    } catch (error) {
        console.error('Error fetching the nearest sea:', error);
        res.status(500).json({ error: 'Internal Server Error'});
    }
}

export default getNearestSea;

