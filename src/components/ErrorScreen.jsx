import './ErrorScreen.css';
import React from 'react';
export const ErrorScreen = ({msg}) => {
    return (
        <div className="error-menu">
            <h1>Error</h1>
            <h2>{msg}</h2>
        </div>
    );
}