import React, {useEffect, useState} from 'react';
import { useData } from './contexts/DataContext';
import LoadingScreen from './components/LoadingScreen';
import TeamEntryForm from './components/TeamEntryForm';
import { useTeamGetting } from './api/pulling/TeamGetting';
import { useNavigate } from 'react-router-dom';
import { Analytics } from "@vercel/analytics/react";
import { faL } from '@fortawesome/free-solid-svg-icons';
export default function Home() {
    const { loading, loadingStatus, teamData, setTeamData } = useData();
    const navigate = useNavigate();

    useEffect(() => {
        if (loadingStatus.includes("Loading team") && loading) {
            const match = loadingStatus.match(/\d+/);
            if (match) {
                const teamNumber = match[0];
                console.log("Resetting team data and navigating..");
                setTeamData(null);

                // React will batch these but teamData will be null when the new page renders
                navigate(`/teams/${teamNumber}`);
            }
            else {
                console.log("No team number found in loading status. WHAT");
            }
            //teamExtraction();
        }
    }, [loadingStatus, loading, navigate]);
    
    if (loading) {
        return <LoadingScreen />;
    }

    return (
        <div>
            <TeamEntryForm />
            <Analytics/>
        </div>
    );
}