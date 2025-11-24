import { useData } from "../contexts/DataContext";
import LoadingScreen from "./LoadingScreen";
import React, {useEffect} from 'react';
import { useTeamGetting } from "../api/pulling/TeamGetting";
import { useParams } from "react-router-dom";
import './Team.css';
import Header from "./Header";
import { saveTeam } from "../api/pulling/TeamCache";
import TeamInfo from "./teamPage/TeamInfo";
import { useExtraGetting } from "../api/pulling/ExtraGetting";
export default function Team() {
    const { loading, setLoading, teamData, loadingExtras, setLoadingExtras} = useData();
    const { teamNumber } = useParams();
    const { teamExtraction } = useTeamGetting();
    const { extraDataExtraction } = useExtraGetting();

    useEffect(() => {
        // Fetch team data based on team number
        console.log(`Fetching data for team ${teamNumber}...`);
        setLoading(true);
        setLoadingExtras(true);
        teamExtraction(teamNumber);
    }, [teamNumber]);

    useEffect(() => {
        if (!loading && loadingExtras) {
            extraDataExtraction();
        }
    }, [loading]);

    useEffect(() => {
        if (teamData?.version === 1) { // got team data and need to save into cache
            console.log(teamData);
            setLoading(false);
            teamData.version = 2;
            saveTeam(teamData);
        } else if (teamData?.version === 2) { // when already saved into cache
            setLoading(false);
        }
    }, [teamData])
    
    if (loading) {
        return <LoadingScreen/>;
    }
    else if (teamData?.version >= 1) {
        return (
            <div className="team-screen">
                <Header/>
                <TeamInfo/>
            </div>
        );
    }
    return <LoadingScreen/>;
}