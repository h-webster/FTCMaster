import { Debug, Debug_Data } from "../../utils/Debug"
import { getEventsByTeamNumber } from "./Events";
import { getAI } from "./openApi";
import { getOPR } from "./OPR";
import { getTeamList } from "./TeamList";
import { useData } from "../../contexts/DataContext";

export const useTeamPulling = () => {
    const { setAiRequestStatus } = useData();

    let team = {};
    let teamMap = null;
    const teamPull = async (teamNumber) => {
        team = {
            name: "",
            number: teamNumber,
            points: [],
            performance: {
                wins: 0,
                losses: 0,
                ties: 0,
                avgRP: 0,
            },
            eventsDone: 0,
            events: [],
            opr: {}
        };
        Debug("Starting team pull...");  
        const teamList = await pullTeamList(); 
        teamMap = new Map(teamList.map(team => [team.number, team.name]));
        team.name = teamMap.get(Number(teamNumber));

        await pullEvents();
        await pullOpr();
        await pullAI();
        Debug_Data(team, "FINAL_TEAM_PULL_001");
        return team;
    }
    const pullEvents = async () => {
        Debug("Pulling events...");
        if (!('number' in team)) {
            console.warn("No number exists in team!");
            return null;
        }
        console.log("");
        const eventData = await getEventsByTeamNumber(team.number);
        //Debug_Data("Event Data: " + JSON.stringify(eventData), "TEAM_PULL_002");
        
        let totalQualPoints = 0;
        let totalPlayoffPoints = 0;
        let totalPlayoffs = 0;
        let totalQuals = 0;
        
        let highScore = 0;
        for (let i = 0; i < eventData.length; i++) {
            const event = eventData[i];
            const eventPerformance = {
                dateStart: event.dateStart,
                dateEnd: event.dateEnd,
                name: event.name,
                done: event.done,
                code: event.code,
                wins: 0,
                losses: 0,
                ties: 0,
                rank: 0,
                matches: [],
                quals: [],
                qualScores: [],
                playoffs: [],
                playoffScores: [],
                rp: 0
            };
            if (event.done) {
                team.eventsDone++;
            }

            if (event.matches.length == 0) {
                eventPerformance.unfinished = true;
                team.events.push(eventPerformance);
                continue;
            }

            // put all teams into eventRankings to eventaully find event ranking position
            for (let k = 0; k < event.rankings.length; k++) {
                const ranking = event.rankings[k];
                if (ranking.number == team.number) {
                    eventPerformance.rank = ranking.rank;
                }
            }

            // pull your matches
            for (let j = 0; j < event.matches.length; j++) {
                const match = event.matches[j];
                const matchPerformance = match;
                if (match.tournamentLevel == "PRACTICE") {
                    continue;
                }
                let alliance = "";
                let found = false;
                for (let matchTeam of matchPerformance.teams) {
                    matchTeam.name = teamMap.get(matchTeam.teamNumber); 
                    if (matchTeam.teamNumber == team.number) {
                        found = true;
                        if (matchTeam.station == "Red1" || matchTeam.station == "Red2" || matchTeam.station == "Red3") {
                            alliance = "Red";
                        } else {
                            alliance = "Blue";
                        }
                    }
                }   
                if (!found) {
                    continue;
                }
                // the code that runs here is only for matches the team participated in

                if (match.tournamentLevel == "QUALIFICATION") {
                    totalQuals++;
                    let scoreDetails = event.qualScores.find(qualScore => qualScore.matchNumber == match.matchNumber);
                    let blueAlliance = scoreDetails.alliances.find(alliance => alliance.alliance == "Blue") || null;
                    let redAlliance = scoreDetails.alliances.find(alliance => alliance.alliance == "Red") || null;
                    
                    if (blueAlliance == null || redAlliance == null) {
                        console.warn("Invalid blue alliance or red alliance");
                    }
                    // only get rp if qualification match
                    let blueRP = 0;
                    let redRP = 0;

                    if (blueAlliance.movementRP) { blueRP++; }
                    if (blueAlliance.patternRP) { blueRP++; }
                    if (blueAlliance.goalRP) { blueRP++; }
                    
                    if (redAlliance.movementRP) { redRP++; }
                    if (redAlliance.patternRP) { redRP++; }
                    if (redAlliance.goalRP) { redRP++; }

                    let myPoints = (alliance == "Blue") ? match.scoreBlueFinal : match.scoreRedFinal;
                    team.points.push(myPoints);
                    totalQualPoints += myPoints;
                    
                    if (myPoints > highScore) {
                        highScore = myPoints;
                    }

                    if (match.scoreBlueFinal > match.scoreRedFinal) {
                        blueRP += 3;
                        if (alliance == "Blue") {
                            eventPerformance.wins++;
                        } else {
                            eventPerformance.losses++;
                        }
                    } else if (match.scoreRedFinal > match.scoreBlueFinal) {
                        redRP += 3;
                        if (alliance == "Red") {
                            eventPerformance.wins++;
                        } else {
                            eventPerformance.losses++;
                        }
                    } else {
                        eventPerformance.ties++;
                        blueRP++;
                        redRP++;
                    }
                    matchPerformance.alliance = alliance;
                    matchPerformance.blueRP = blueRP;
                    matchPerformance.redRP = redRP;
                    eventPerformance.rp += (alliance == "Red") ? redRP : blueRP;
                    eventPerformance.totTeams = event.rankings.length;
                    eventPerformance.quals.push(matchPerformance);
                    eventPerformance.qualScores.push(scoreDetails);
                } else if (match.tournamentLevel == "PLAYOFF") {
                    totalPlayoffs++;
                    let scoreDetails = event.playoffScores.find(playoffScore => playoffScore.matchSeries == match.series);
                    let blueAlliance = scoreDetails.alliances.find(alliance => alliance.alliance == "Blue") || null;
                    let redAlliance = scoreDetails.alliances.find(alliance => alliance.alliance == "Red") || null;
                    
                    if (blueAlliance == null || redAlliance == null) {
                        console.warn("Invalid blue alliance or red alliance");
                    }

                    let myPoints = (alliance == "Blue") ? match.scoreBlueFinal : match.scoreRedFinal;
                    totalPlayoffPoints += myPoints;
                    if (myPoints > highScore) {
                        highScore = myPoints;
                    }
                    
                    matchPerformance.alliance = alliance;

                    eventPerformance.playoffs.push(matchPerformance);
                    eventPerformance.playoffScores.push(scoreDetails);
                } else {
                    console.warn("Unknown tournament level: " + match.tournamentLevel);
                }
                
                eventPerformance.matches.push(matchPerformance);
            }
            team.performance.wins += eventPerformance.wins;
            team.performance.losses += eventPerformance.losses;
            team.performance.ties += eventPerformance.ties;
            if (eventPerformance.rp > 0) {
                eventPerformance.rp = eventPerformance.rp / (eventPerformance.quals.length);
            }
            if (team.events.length > 0) {
                team.pointAveragePlayoff = Math.round((totalPlayoffPoints / totalPlayoffs)*10)/10;
                team.pointAverage = Math.round((totalQualPoints / totalQuals)*10)/10;
            }
            team.performance.avgRP += eventPerformance.rp;
            team.events.push(eventPerformance);
        }
        team.performance.highScore = highScore;
        if (team.events.length > 0) {
            team.performance.avgRP = team.performance.avgRP / team.events.length;
        }
    }
    const pullOpr = async () => {
        Debug("Pulling OPR...");
        if (!('number' in team)) {
            console.warn("No number exists in team!");
            return null;
        }

        const oprData = await getOPR(team.number);
        if (oprData != null && 'tot' in oprData){
            team.opr = oprData;
        } else {
            team.opr = {};
        }
    }
    const pullTeamList = async () => {
        Debug("Pulling team list...");
        const data = await getTeamList();
        for (const listTeam of data) {
            if (listTeam.number == team.number) {
                team.info = listTeam;
            }
        }
        Debug_Data(data, "TEAMLISTULKL");
        return data;
    }
    const pullAI = async () => {
        Debug("Pulling ai...");
        setAiRequestStatus(null);
        const aiData = await getAI(team.number);
        if (aiData) {
            setAiRequestStatus({
                number: team.number,
                loading: false,
                data: aiData
            });
        }
        Debug_Data(aiData, "Pull_AI_DATA");
    }

    return {teamPull};
} 