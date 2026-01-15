import React, {useEffect, useState} from 'react';
import { useData } from '../contexts/DataContext';
import TeamEntryForm from './TeamEntryForm';
import { useTeamGetting } from '../api/pulling/TeamGetting';
import { useLocation, useNavigate } from 'react-router-dom';
import { Analytics } from "@vercel/analytics/react";
import { faL } from '@fortawesome/free-solid-svg-icons';
import LoadingScreen from './LoadingScreen';

const BASE_URL = "https://www.ftcmaster.org/";
export default function TeamLookup() {
    const { loading, loadingStatus, teamData, setTeamData } = useData();
    const { pathname } = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        let link = document.querySelector("link[rel='canonical']");
        if (!link) {
            link = document.createElement("link");
            link.rel = "canonical";
            document.head.appendChild(link);
        }
        link.href = `${BASE_URL}${pathname}`;
    }, [pathname]);

    useEffect(() => {
        let desc = document.querySelector("meta[name='description']");
        if (!desc) {
            desc = document.createElement("meta");
            desc.name = "description";
            document.head.appendChild(desc);
        }
        desc.content = "FTCMaster is your ultimate scouting resource for FTC robotics competitions, team info, and strategy insights.";
    }, []);

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
        return <LoadingScreen/>
    }


    return (
        <div>
            <TeamEntryForm />
            <Analytics/>
        </div>
    );
}