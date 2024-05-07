import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const SunDistancePage: React.FC = () => {
    const [distanceToSun, setDistanceToSun] = useState<string>('Calculating...');
    const [latitude, setLatitude] = useState<string>('Fetching...');
    const [longitude, setLongitude] = useState<string>('Fetching...');
    const [error, setError] = useState<string>('');
    const router = useRouter();

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setLatitude(latitude.toFixed(6));
                    setLongitude(longitude.toFixed(6));

                    try {
                        const distance = calculateDistanceToSun(latitude, longitude);
                        setDistanceToSun(`Distance to the Sun's core: ${distance.toFixed(2)} km`);
                    } catch (error) {
                        console.error('Failed to calculate distance to the Sun:', error);
                        setError('Failed to calculate distance to the Sun.');
                    }
                },
                (error) => {
                    console.error('Geolocation error:', error);
                    setError('Failed to retrieve your location.');
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
            height: '100vh',
            backgroundColor: '#FFF9C4',  // Light yellow background
            color: '#FFEB3B'  // Yellow text for contrast
        }}>
            <h1 style={{ color: '#FDD835' }}>Distance to the Sun</h1>
            <div style={{
                padding: '20px',
                backgroundColor: '#FFEB3B',  // Bright yellow for the inner box
                color: '#FFF176',  // Light yellow text for details
                border: '1px solid #FBC02D',  // Dark yellow border
                borderRadius: '5px',
                maxWidth: '400px',
                textAlign: 'center',
                boxShadow: '0px 0px 15px 5px rgba(0,0,0,0.2)'  // Soft shadow for 3D effect
            }}>
                {error ? <p>{error}</p> : (
                    <>
                        <p data-testid="latitude" style={{ color: '#000' }}>Latitude: {latitude}</p>
                        <p data-testid="longitude" style={{ color: '#000' }}>Longitude: {longitude}</p>
                        <p data-testid="distance-to-sun" style={{ color: '#000' }}>{distanceToSun}</p>
                    </>
                )}
            </div>
            <button onClick={() => router.push('/')} style={{
                marginTop: '20px',
                padding: '10px 20px',
                fontSize: '16px',
                borderRadius: '5px',
                border: 'none',
                backgroundColor: '#FBC02D',  // Darker yellow button
                color: '#3E2723',  // Deep brown text to ensure readability
                cursor: 'pointer',
                boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.2)'
            }}>
                Back to Home
            </button>
        </div>
    );
};

function calculateDistanceToSun(latitude: number, longitude: number): number {
    const date = new Date();
    const dayOfYear = getDayOfYear(date);
    const eccentricity = 0.0167;
    const semiMajorAxis = 149600000; // Average distance to sun in km

    // Calculate current distance from the Earth to the Sun
    const distanceToSun = semiMajorAxis * (1 - eccentricity * Math.cos(2 * Math.PI * (dayOfYear - 3) / 365.25));

    // Adjustment for Earth's rotation
    const earthRadius = 6371; // in kilometers
    const timeOffset = (date.getUTCHours() + date.getUTCMinutes() / 60 + date.getUTCSeconds() / 3600 + longitude / 15) % 24;
    const angleFromSun = 2 * Math.PI * (timeOffset / 24);
    const distanceAdjustment = earthRadius * Math.cos(latitude * Math.PI / 180) * Math.sin(angleFromSun);

    return distanceToSun + distanceAdjustment; // in kilometers
}

function getDayOfYear(date: Date): number {
    const start = new Date(date.getFullYear(), 0, 0);
    const diff = (date.getTime() - start.getTime()) + ((start.getTimezoneOffset() - date.getTimezoneOffset()) * 60 * 1000);
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
}

export default SunDistancePage;
