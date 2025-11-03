import { useData } from "../../contexts/DataContext";
import React from "react";
import './TeamInfo.css';
import SimpleStats from "./SimpleStats";

export default function TeamInfo() {
    const { teamData } = useData();
    return (
        <div className='team-info'>
            <div className="team-header">
                <h1>Team #{teamData.number} - {teamData.info.name}</h1>
            </div>
            <div className="dashboard-content">
                <SimpleStats/>
            </div>
        </div>
    );
}