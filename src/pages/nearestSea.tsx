// NearestSeaPage component
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

const NearestSeaPage: React.FC = () => {
    const [latitude, setLatitude] = useState<string>('Fetching...');
    const [longitude, setLongitude] = useState<string>('Fetching...');
    const [distance, setDistance] = useState<string>('Calculating...');
    const [error, setError] = useState<string>('');
    const router = useRouter();

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    setLatitude(latitude.toFixed(6));
                    setLongitude(longitude.toFixed(6));

                    try {
                        const response = await axios.get('/api/getNearestSea', {
                            params: {
                                latitude: latitude,
                                longitude: longitude
                            }
                        });
                        if (response.data && response.data.name) {
                            setDistance(`The nearest sea, ${response.data.name}, is ${response.data.distance} away`);
                        } else {
                            setError('No nearest sea found');
                        }
                    } catch (error) {
                        console.error('Failed to retrieve the nearest sea:', error);
                        setError('Failed to retrieve data for the nearest sea.');
                    }
                },
                (error) => {
                    if (error.code === error.PERMISSION_DENIED) {
                        setError('Permission denied for location access.');
                    } else {
                        setError('Failed to retrieve your location.');
                    }
                },
                { enableHighAccuracy: true }
            );
        } else {
            setError('Geolocation is not supported by this browser.');
        }
    }, []);

    return (
        <div style={{
            fontFamily: 'Arial, sans-serif',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            backgroundColor: '#f0f0f0',
            color: '#333',
            textAlign: 'center'
        }}>
            <h1 style={{ color: '#00457C' }}>Nearest Sea Finder</h1>
            <div style={{ marginBottom: '20px', fontSize: '18px' }}>
                Latitude: <span id="latitude" data-testid="latitude">{latitude}</span><br />
                Longitude: <span id="longitude" data-testid="longitude">{longitude}</span>
            </div>
            <div style={{
                padding: '20px',
                backgroundColor: '#dff0d8',
                color: '#3c763d',
                border: '1px solid #d6e9c6',
                borderRadius: '5px',
                maxWidth: '400px',
                boxSizing: 'border-box'
            }}>
                {error ? <p style={{ color: '#a94442' }}>{error}</p> : <p>{distance}</p>}
            </div>
            <button onClick={() => router.push('/sunDistance')} style={{
                marginTop: '20px',
                padding: '10px 20px',
                fontSize: '16px',
                borderRadius: '5px',
                border: 'none',
                color: '#fff',
                backgroundColor: '#007BFF',
                cursor: 'pointer'
            }}>
                Go to Distance to the Sun's Core
            </button>
        </div>
    );
}

export default NearestSeaPage;
