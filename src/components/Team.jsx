import { useData } from "../contexts/DataContext";
import LoadingScreen from "./LoadingScreen";
import React, {useEffect} from 'react';
import { useTeamGetting } from "../api/pulling/TeamGetting";
import { useParams } from "react-router-dom";
import './Team.css';
import Header from "./Header";
import { saveTeam } from "../api/pulling/TeamCache";
import TeamInfo from "./teamPage/TeamInfo";
import { useTeamPulling } from "../api/pulling/TeamPull";
import { Debug, Debug_Data } from "../utils/Debug";
import {ErrorScreen} from "./ErrorScreen";
import { Analytics } from "@vercel/analytics/react";
export default function Team() {
    const { loading, setLoading, teamData, loadingExtras, setLoadingExtras, setTeamData, setAiRequestStatus } = useData();
    const { teamNumber } = useParams();
    const { teamPull } = useTeamPulling();
    const hasFetched = React.useRef(false);

    useEffect(() => {
        async function fetchTeamData() {
            // fetch team data only once
            if (teamNumber && !hasFetched.current) {
                // Fetch team data based on team number
                hasFetched.current = true;
                console.log(`Fetching data for team ${teamNumber}...`);
                setLoading(true);
                setLoadingExtras(true);
                for (let i = 0; i < 10; i++) {
                    console.log("======================")
                }
                const newTeamData = await teamPull(teamNumber);
                setTeamData(newTeamData);
            }
        }
        if (teamData && 'number' in teamData && teamNumber != teamData.number) {
            hasFetched.current = false;
        }
        if (teamData == null || !('number' in teamData) || teamNumber != teamData.number){
        }
        fetchTeamData();
    }, [teamNumber]);

    useEffect(() => {
        if (teamData != null && 'number' in teamData) {
            setLoading(false);
        }
    }, [teamData])
   
    if (loading) {
        return <LoadingScreen/>;
    }
    else if (teamData != null) {
        if (!('name' in teamData) || teamData.name == undefined) {
            return (
                <div className="team-screen">
                    <Header/>
                    <ErrorScreen msg="Unknown team number." />
                </div>
            );
        }
        
        return (
            <div className="team-screen">
                <Header/>
                <TeamInfo/>
                <Analytics/>
            </div>
        );
    }
    return <LoadingScreen/>;
}