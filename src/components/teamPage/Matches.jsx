import { useData } from "../../contexts/DataContext";
import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faRankingStar } from '@fortawesome/free-solid-svg-icons';
import './Matches.css';

export default function Matches() {
    const { teamData } = useData();

    return (
        <div className='matches'>
            {teamData.events.map((e, idx) => {
                const teamRank = e.rankings.find(team => team.number == teamData.number);
                return (
                    <div className="event" key={idx}>
                        <h2 className='event-title'>{e.name} {idx}</h2>
                        <h3 className='event-small'><FontAwesomeIcon icon={faCalendar} /> 
                        {new Date(e.dateStart).toLocaleDateString('en-US', {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric'
                        })} - {new Date(e.dateEnd).toLocaleDateString('en-US', {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric'
                        })}
                        </h3>
                        <h3 className='event-small'><FontAwesomeIcon icon={faRankingStar} /> Qualification Position: {teamRank?.rank || 'N/A'}/{e.rankings.length}</h3>
                    </div>
                );
            })}
        </div>
    );
}