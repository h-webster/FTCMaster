import { useData } from "../../contexts/DataContext";
import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar } from '@fortawesome/free-solid-svg-icons';
import './Matches.css';

export default function Matches() {
    const { teamData } = useData();

    const startDate = new Date()
    return (
        <div className='matches'>
            {teamData.events.map((e, idx) => (
                <div className="event" key={idx}>
                    <h2 className='event-title'>{e.name}</h2>
                    <h3 className='event-small'><FontAwesomeIcon icon={faCalendar} /> 
                    {new Date(e.dateStart).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                    })} - 
                    {new Date(e.dateEnd).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                    })}
                    </h3>
                </div>
            ))}
        </div>
    );
}