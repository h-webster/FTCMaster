import { useData } from "../../contexts/DataContext";
import React from "react";
import './TeamInfo.css';
import SimpleStats from "./SimpleStats";
import Matches from "./Matches";
import { TeamCharts } from "./TeamCharts";
import AIInsight from "./aiInsight";

export default function TeamInfo() {
    const { teamData } = useData();
    return (
        <div className='team-info'>
            <div className="team-header">
                { (teamData && teamData.info) &&
                    <h1>Team #{teamData.number} - {teamData.info.name}</h1> 
                }
            </div>
            {teamData.events.length > 0 ? (
                <div className="dashboard-content">
                    <SimpleStats/>
                    <AIInsight/>
                    <TeamCharts/>
                    <Matches/>
                </div>
            ) : (
                <div className="dashboard-content">
                    <SimpleStats/>
                    <h2>This team has played no events</h2>
                </div>
            )}
                
        </div>
    );
}