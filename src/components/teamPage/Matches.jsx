import { useData } from "../../contexts/DataContext";
import React, { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faRankingStar, faTrophy, faCircle } from '@fortawesome/free-solid-svg-icons';
import './Matches.css';
import { useNavigate } from "react-router-dom";
import MatchDetails from "./MatchDetails";

export default function Matches() {
    const { teamData, setLoadingStatus} = useData();
    const navigate = useNavigate();
    const [activeMatch, setActiveMatch] = useState(null);
    
    const openTeam = (teamNumber) => {
        setLoadingStatus(`Loading team ${teamNumber}...`);
        navigate(`/teams/${teamNumber}`);
    }
    return (
        <div className='matches'>
            {teamData.events
            .sort((a, b) => new Date(b.dateStart) - new Date(a.dateStart))
            .map((e, idx) => {
                const teamRank = e.rank;
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
                        { (e.done && e.matches.length > 0) &&
                            <>
                                <h3 className='event-small'><FontAwesomeIcon icon={faRankingStar} /> League Relevant Position: {teamRank || 'N/A'}/{e.totTeams}</h3>
                                <h3 className="event-small"><FontAwesomeIcon icon={faTrophy} /> Ranking Score (RS): { e.rp ? Number(e.rp).toFixed(2) : 'N/A'}</h3>
                                <h3 className="event-small">W-L-T: {e.wins}-{e.losses}-{e.ties}</h3>
                            </>
                        }
                        { e.quals.length > 0 && 
                            <h4 className='match-key'><FontAwesomeIcon icon={faCircle} className='match-key-icon' style={{color: '#ff1f1fff'}} />- Ranking Point</h4>
                        }
                        { (e.quals.length == 0 && e.playoffs.length == 0) ? (
                            <h3 className="center-text">No matches available</h3>
                        ) : (
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
                                    {(e.quals && e.quals.length > 0) &&
                                        <>
                                            <tr><td colSpan={4} className="quals-display">Qualifications</td></tr>
                                            {e.quals.map((m, jdx) => {
                                                const scores = e.qualScores.find(match => match.matchNumber == m.matchNumber);
                                                const blueAlliance = scores.alliances.find(a => a.alliance == "Blue");
                                                const redAlliance = scores.alliances.find(a => a.alliance == "Red");
                                                const score = {
                                                    blue: blueAlliance,
                                                    red: redAlliance,
                                                    randomization: scores.randomization
                                                };
                                                return (
                                                    <Match key={jdx} m={m} event={e} teamData={teamData} nav={navigate} type="qualification" onOpen={() => setActiveMatch({match: m, score: score})} onOpenTeam={openTeam}/>
                                                );
                                            })} 
                                        </>
                                    }
                                    {(e.playoffs && e.playoffs.length > 0) &&
                                        <>
                                            <tr><td colSpan={4} className="quals-display">Playoffs</td></tr>
                                            {e.playoffs.map((m, jdx) => {
                                                const scores = e.playoffScores.find(match => match.matchSeries == m.series);
                                                const blueAlliance = scores.alliances.find(a => a.alliance == "Blue");
                                                const redAlliance = scores.alliances.find(a => a.alliance == "Red");
                                                const score = {
                                                    blue: blueAlliance,
                                                    red: redAlliance,
                                                    randomization: scores.randomization
                                                }; 
                                                return (
                                                    <Match key={jdx} m={m} event={e} teamData={teamData} nav={navigate} type="playoff" onOpen={() => setActiveMatch({match: m, score: score})} onOpenTeam={openTeam}/>
                                                )
                                            })}
                                        </>
                                    }
                                </tbody>
                            </table>
                        )}
                       
                        {activeMatch && (
                            <div className="modal-overlay" onClick={() => setActiveMatch(null)}>
                                <div className="modal-box" onClick={e => e.stopPropagation()}>
                                    <h2 className="center-text">Match Details</h2>
                                    <table className="details-table">
                                        <thead>
                                            <tr>
                                                <th className="blank"></th>
                                                <th className="red-col">Red</th>
                                                <th className="blue-col">Blue</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <MatchDetails activeMatch={activeMatch}/>
                                        </tbody>
                                    </table>
                                    <button className="close-button" onClick={() => setActiveMatch(null)}>Close</button>
                                </div>
                            </div>
                        )}

                    </div>
                );
            })}
        </div>
    );
}




const Match = ({m, teamData, event, nav, type, onOpen, onOpenTeam}) => {

    let scoreDetails;
    let matchNum;
    if (type == "playoff") {
        scoreDetails = event.playoffScores.find(playoffScore => playoffScore.matchSeries == m.series);
        matchNum = "M-"+m.series;
    } else if (type == "qualification") {
        scoreDetails = event.qualScores.find(qualScore => qualScore.matchNumber == m.matchNumber);
        matchNum = "Q-"+m.matchNumber;
    } else {
        console.warn("unknown tournament level type");
    }
    return (
        <>
            <tr>
                <td>{matchNum}</td>
                <td>
                    <button onClick={onOpen} className="score">
                        <div className="redScore">
                            <span style={{fontWeight: m.alliance === "Red" ? "bold" : "normal"}}>{m.scoreRedFinal}</span>
                            { type === "qualification" &&
                                <div className="ranking-points">
                                    {Array.from({ length: m.redRP}).map((_, index) => (
                                        <FontAwesomeIcon key={index} icon={faCircle} style={{color: '#ff1f1fff'}} />
                                    ))}
                            </div>
                            }
                        </div>
                        <span className="sep">-</span>
                        <div className="blueScore">
                            <span style={{fontWeight: m.alliance === "Blue" ? "bold" : "normal"}}>{m.scoreBlueFinal}</span>
                            <div className="ranking-points">
                                {Array.from({ length: m.blueRP}).map((_, index) => (
                                    <FontAwesomeIcon key={index} icon={faCircle} style={{color: '#1f40ff'}} />
                                ))}
                            </div>
                        </div>
                        { (m.alliance == "Red" && m.scoreRedFinal > m.scoreBlueFinal) || (m.alliance == "Blue" && m.scoreBlueFinal > m.scoreRedFinal) ? (
                            <span className='winnerIndicator winIndicator'>👑 Win</span>
                            ) : (m.scoreRedFinal == m.scoreBlueFinal) ? (
                            <span className='winnerIndicator tieIndicator'>😬 Tie</span>
                            ) : (
                            <span className='winnerIndicator lossIndicator'>❌ Lose</span>
                        )}
                    </button>
                </td>
                <td className="redTeam">
                    <div className="teamShow">
                        {m.teams.filter(team => team.station.startsWith("Red")).map((team, kdx) => {
                            const isCurrentTeam = team.teamNumber == teamData.number;
                            const textDecoration = isCurrentTeam ? 'underline' : 'none';
                            return (
                                <button onClick={() => onOpenTeam(team.teamNumber)} key={kdx} className='team'>
                                    <p className="teamNumber" style={{ textDecoration }}>
                                        {team.teamNumber}
                                    </p>
                                    <p className="teamName" style={{ textDecoration }}>
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
                            const textDecoration = isCurrentTeam ? 'underline' : 'none';
                            return (
                                <button onClick={() => onOpenTeam(team.teamNumber)} key={kdx} className='team'>
                                    <p className="teamNumber" style={{ textDecoration }}>
                                        {team.teamNumber}
                                    </p>
                                    <p className="teamName" style={{ textDecoration }}>
                                        {team.name}
                                    </p>
                                </button>
                            ); 
                        })}
                    </div>
                </td>
            </tr>
        </>
    );
}