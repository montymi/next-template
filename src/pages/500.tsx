import React from 'react';

const ServerErrorPage = () => {
    return (
        <div style={{ 
            display: 'flex', 
            height: '100vh', 
            justifyContent: 'center', 
            alignItems: 'center', 
            flexDirection: 'column',
            textAlign: 'center'
        }}>
            <h1>500 - Server-side error occurred</h1>
            <p>Sorry, something went wrong on our end.</p>
        </div>
    );
};

export default ServerErrorPage;