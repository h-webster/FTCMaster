import './LoadingScreen.css';
import React from 'react';
import { useData } from '../contexts/DataContext';

export default function LoadingScreen() {
    const { loadingStatus } = useData();
    return (
        <div className="loading-screen">
            <h2>Loading...</h2>
            <p>{loadingStatus}</p>
        </div>
    );
}