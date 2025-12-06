import React, {useEffect} from 'react';
import { useData } from './contexts/DataContext';
import LoadingScreen from './components/LoadingScreen';
import TeamEntryForm from './components/TeamEntryForm';
import { useTeamGetting } from './api/pulling/TeamGetting';
import { useNavigate } from 'react-router-dom';
export default function Home() {
    const { loading, loadingStatus } = useData();
    const navigate = useNavigate();

    
    useEffect(() => {
        if (loadingStatus.includes("Loading team") && loading) {
            const match = loadingStatus.match(/\d+/);
            if (match) {
                const teamNumber = match[0];
                console.log("NAVIGATE");
                navigate(`/teams/${teamNumber}`);
            }
            else {
                console.log("No team number found in loading status. WHAT");
            }
            //teamExtraction();
        }
    }, [loadingStatus, loading]);
    
    if (loading) {
        return <LoadingScreen />;
    }

    return (
        <div>
            <TeamEntryForm />
        </div>
    );
}