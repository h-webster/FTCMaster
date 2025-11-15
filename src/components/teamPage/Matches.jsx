import { useData } from "../../contexts/DataContext";
import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faRankingStar } from '@fortawesome/free-solid-svg-icons';
import './Matches.css';
import { useNavigate } from "react-router-dom";

export default function Matches() {
    const { teamData} = useData();
    const navigate = useNavigate();

    return (
        <div className='matches'>
            {teamData.events.map((e, idx) => {
                const teamRank = e.rankings.find(team => team.number == teamData.number);
                return (
                    <div className="event" key={idx}>
                        <h2 className='event-title'>{e.name}</h2>
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
                        { e.done &&
                            <h3 className='event-small'><FontAwesomeIcon icon={faRankingStar} /> Qualification Position: {teamRank?.rank || 'N/A'}/{e.rankings.length}</h3>
                        }
                        <table className='matches-table'>
                            <thead>
                                <tr className="header-row">
                                    <th className='header-match'>Match</th>
                                    <th className='header-score'>Score</th>
                                    <th className="header-red">Red</th>
                                    <th className="header-blue">Blue</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(e.qualMatches && e.qualMatches.length > 0) &&
                                    <>
                                        <tr><td colSpan={4} className="quals-display">Qualifications</td></tr>
                                        {e.qualMatches.map((m, jdx) => (
                                            <Match key={jdx} m={m} teamData={teamData} nav={navigate} />
                                        ))}
                                    </>
                                }
                                {(e.playoffMatches && e.playoffMatches.length > 0) &&
                                    <>
                                        <tr><td colSpan={4} className="quals-display">Playoffs</td></tr>
                                        {e.playoffMatches.map((m, jdx) => (
                                            <Match key={jdx} m={m} teamData={teamData} nav={navigate} />
                                        ))}
                                    </>
                                }
                            </tbody>
                        </table>
                    </div>
                );
            })}
        </div>
    );
}

const openTeam = (teamNumber, nav) => {
    nav(`/teams/${teamNumber}`);
}

const Match = ({m, teamData, nav}) => {
    return (
        <tr>
            <td>{m.matchNumber}</td>
            <td><span className="redScore">{m.scoreRedFinal}</span>-<span className="blueScore">{m.scoreBlueFinal}</span>
            { (m.alliance == "Red" && m.scoreRedFinal > m.scoreBlueFinal) || (m.alliance == "Blue" && m.scoreBlueFinal > m.scoreRedFinal) ? (
                <span className='winnerIndicator winIndicator'>👑 Win</span>
                ) : (m.scoreRedFinal == m.scoreBlueFinal) ? (
                <span className='winnerIndicator tieIndicator'>😬 Tie</span>
                ) : (
                <span className='winnerIndicator lossIndicator'>❌ Lose</span>
            )}
            </td>
            <td className="redTeam">
                <div className="teamShow">
                    {m.teams.filter(team => team.station.startsWith("Red")).map((team, kdx) => {
                        const isCurrentTeam = team.teamNumber == teamData.number;
                        const fontWeight = isCurrentTeam ? 'bold' : 'normal';
                        return (
                            <button onClick={() => openTeam(team.teamNumber, nav)} key={kdx} className='team'>
                                <p className="teamNumber" style={{ fontWeight }}>
                                    {team.teamNumber}
                                </p>
                                <p className="teamName" style={{ fontWeight }}>
                                    {team.name}
                                </p>
                            </button>
                        );
                    })}   
                </div> 
            </td>
            <td className="blueTeam">
                <div className="teamShow">
                    {m.teams.filter(team => team.station.startsWith("Blue")).map((team, kdx) => {
                        const isCurrentTeam = team.teamNumber == teamData.number;
                        const fontWeight = isCurrentTeam ? 'bold' : 'normal';
                        return (
                            <button onClick={() => openTeam(team.teamNumber, nav)} key={kdx} className='team'>
                                <p className="teamNumber" style={{ fontWeight }}>
                                    {team.teamNumber}
                                </p>
                                <p className="teamName" style={{ fontWeight }}>
                                    {team.name}
                                </p>
                            </button>
                        );
                    })}
                </div>
            </td>
        </tr>
    );
}