import React, {useEffect} from 'react';
import { useData } from './contexts/DataContext';
import LoadingScreen from './components/LoadingScreen';
import TeamEntryForm from './components/TeamEntryForm';
import { useTeamGetting } from './api/TeamGetting.jsx';
import { useNavigate } from 'react-router-dom';
export default function Home() {
    const { loading, loadingStatus } = useData();
    const navigate = useNavigate();

    
    const { teamExtraction } = useTeamGetting();
    useEffect(() => {
        console.log(loadingStatus);
        if (loadingStatus.includes("Loading team")) {
            const match = loadingStatus.match(/\d+/);
            if (match) {
                const teamNumber = match[0];
                navigate(`/teams/${teamNumber}`);
            }
            else {
                console.log("No team number found in loading status. WHAT");
            }
            //teamExtraction();
        }
    }, [loadingStatus]);
    
    if (loading) {
        return <LoadingScreen />;
    }

    return (
        <div>
            <TeamEntryForm />
        </div>
    );
}