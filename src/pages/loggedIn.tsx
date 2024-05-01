import React from 'react';

const LoggedInPage = () => {
    return (
        <div style={{
            fontFamily: 'Arial, sans-serif',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            backgroundColor: '#f0f0f0',
        }}>
            <div style={{
                padding: '20px',
                backgroundColor: '#dff0d8',
                color: '#3c763d',
                border: '1px solid #d6e9c6',
                borderRadius: '5px',
            }}>
                Successfully Logged In
            </div>
        </div>
    );
}

export default LoggedInPage;
