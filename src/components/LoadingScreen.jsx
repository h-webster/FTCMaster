import './LoadingScreen.css';
import React from 'react';
import { useData } from '../contexts/DataContext';
import Header from './Header';
import { ClipLoader } from "react-spinners";

export default function LoadingScreen() {
    const { loadingStatus } = useData();
    return (
        <>
            <Header />
            <div className="loading-screen">
                <ClipLoader
                    color={"#2fe06aff"}
                    loading={true}
                    size={150}
                    aria-label="Loading Spinner"
                    data-testid="loader"
                />
                <p>{loadingStatus}</p>
            </div>
        </>
    );
}