import { useData } from "../contexts/DataContext";
import LoadingScreen from "./LoadingScreen";
import React, {useEffect} from 'react';
import { useTeamGetting } from "../api/getting/TeamGetting";
import { useParams } from "react-router-dom";
import './Team.css';
import Header from "./Header";
export default function Team() {
    const { loading, setLoading, teamData} = useData();
    const { teamNumber } = useParams();
    const { teamExtraction } = useTeamGetting();

    useEffect(() => {
        // Fetch team data based on team number
        console.log(`Fetching data for team ${teamNumber}...`);
        setLoading(true);
        teamExtraction(teamNumber);
    }, [teamNumber]);

    useEffect(() => {
        if (teamData?.version === 1) {
            console.log(teamData);
            setLoading(false);
        }
    }, [teamData])
    
    if (loading) {
        return <LoadingScreen/>;
    }
    else if (teamData?.version === 1) {
        return (
            <div className="team-screen">
                <Header/>
                <h1>Team Page for {teamData.number}</h1>
            </div>
        );
    }
    return <LoadingScreen/>;
}