import React, { useState, useEffect, CSSProperties } from 'react';
import { useRouter } from 'next/navigation';

const styles = {
    pageContainer: {
        fontFamily: 'Arial, sans-serif',
        display: 'flex' as const, 
        flexDirection: 'column' as const, 
        justifyContent: 'center' as const,
        alignItems: 'center' as const,
        height: '100vh',
        backgroundColor: '#FFF9C4',
        color: '#FFEB3B',
        textAlign: 'center' as const
    },
    header: {
        color: '#FDD835',
    },
    formContainer: {
        display: 'flex',
        flexDirection: 'column' as const,
        padding: '20px',
        backgroundColor: '#FFEB3B',
        color: '#FFF176',
        border: '1px solid #FBC02D',
        borderRadius: '5px',
        maxWidth: '400px',
        textAlign: 'center' as const,
        boxShadow: '0px 0px 15px 5px rgba(0,0,0,0.2)'
    },
    inputContainer: {
        display: 'flex',
        flexDirection: 'column' as const,
        marginBottom: '20px'
    },
    inputField: {
        padding: '10px',
        margin: '5px',
        borderRadius: '5px',
        border: '1px solid #FBC02D',
        width: '250px'
    },
    button: {
        backgroundColor: '#FBC02D',
        color: '#3E2723',
        padding: '10px 20px',
        margin: '5px',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '16px',
        border: 'none'
    },
    distanceDisplay: {
        fontSize: '18px',
        color: '#000',
        marginBottom: '10px'
    },
    errorText: {
        color: '#D32F2F',
        marginBottom: '10px'
    },
    backButton: {
        marginTop: '20px',
        padding: '10px 20px',
        fontSize: '16px',
        borderRadius: '5px',
        backgroundColor: '#FBC02D',
        color: '#3E2723',
        cursor: 'pointer',
        border: 'none'
    }
};

const SunDistancePage: React.FC = () => {
    const [distanceToSun, setDistanceToSun] = useState<string>('Enter coordinates or get your location to calculate distance.');
    const [latitude, setLatitude] = useState<string>('');
    const [longitude, setLongitude] = useState<string>('');
    const [error, setError] = useState<string>('');
    const router = useRouter();

    const handleCalculateClick = () => {
        if (!latitude || !longitude) {
            setError('Please provide both latitude and longitude.');
            return;
        }
        calculateDistance(parseFloat(latitude), parseFloat(longitude));
    };

    const handleGetLocationClick = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setLatitude(latitude.toFixed(6));
                    setLongitude(longitude.toFixed(6));
                    calculateDistance(latitude, longitude);
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
    };

    const calculateDistance = (lat: number, lon: number) => {
        try {
            const distance = calculateDistanceToSun(lat, lon);
            setDistanceToSun(`Distance to the Sun's core: ${distance.toFixed(2)} km`);
            setError('');
        } catch (error) {
            console.error('Failed to calculate distance to the Sun:', error);
            setError('Failed to calculate distance to the Sun.');
        }
    };

    return (
        <div style={styles.pageContainer}>
            <h1 style={styles.header}>Distance to the Sun</h1>
            <div style={styles.inputContainer}>
                <input
                    type="text"
                    value={latitude}
                    onChange={(e) => setLatitude(e.target.value)}
                    placeholder="Enter latitude"
                    style={styles.inputField}
                />
                <input
                    type="text"
                    value={longitude}
                    onChange={(e) => setLongitude(e.target.value)}
                    placeholder="Enter longitude"
                    style={styles.inputField}
                />
                <button onClick={handleCalculateClick} style={styles.button}>Calculate Distance</button>
                <button onClick={handleGetLocationClick} style={styles.button}>Get My Location</button>
            </div>
            <p style={styles.distanceDisplay}>{distanceToSun}</p>
            {error && <p style={styles.errorText}>{error}</p>}
            <button onClick={() => router.push('/')} style={styles.backButton}>Back to Home</button>
        </div>
    );
};

function calculateDistanceToSun(latitude: number, longitude: number): number {
    const date = new Date();
    const dayOfYear = getDayOfYear(date);
    const eccentricity = 0.0167;
    const semiMajorAxis = 149600000; 

    const distanceToSun = semiMajorAxis * (1 - eccentricity * Math.cos(2 * Math.PI * (dayOfYear - 3) / 365.25));
    const earthRadius = 6371; 
    const timeOffset = (date.getUTCHours() + date.getUTCMinutes() / 60 + date.getUTCSeconds() / 3600 + longitude / 15) % 24;
    const angleFromSun = 2 * Math.PI * (timeOffset / 24);
    const distanceAdjustment = earthRadius * Math.cos(latitude * Math.PI / 180) * Math.sin(angleFromSun);

    return distanceToSun + distanceAdjustment; 
}

function getDayOfYear(date: Date): number {
    const start = new Date(date.getFullYear(), 0, 0);
    const diff = (date.getTime() - start.getTime()) + ((start.getTimezoneOffset() - date.getTimezoneOffset()) * 60 * 1000);
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
}



export default SunDistancePage;
