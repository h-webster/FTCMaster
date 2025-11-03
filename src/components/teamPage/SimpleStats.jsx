import { useData } from "../../contexts/DataContext";
import React from "react";
import './TeamInfo.css';

export default function SimpleStats() {
    const { teamData } = useData();
    return (
        <div className='simple-stats'>
            <h3>Location: {teamData.info.location}</h3>
        </div>
    );
}