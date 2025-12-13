import { useData } from "../../contexts/DataContext";
import React from "react";
import { SimpleStatTooltip } from "./SimpleStatTooltip";
import './TeamInfo.css';

export default function SimpleStats() {
    const { teamData } = useData();
    return (
        <div className='simple-stats'>
            <h3>Location: {teamData?.info?.location || "Unknown"}</h3>
            <h3>Rookie Year: {teamData?.info?.rookieYear}</h3>
            { teamData.events.length > 0 &&
                <SimpleStatTooltip
                    tooltipText={`Playoff Average: ${teamData.pointAveragePlayoff} <br>Qual Average (What's shown): ${teamData.pointAverage}`}
                    position="top">
                    <h3 className="hasTooltip">Average Points: {teamData.pointAverage}</h3>
                </SimpleStatTooltip>
            }
        </div>
    );
}