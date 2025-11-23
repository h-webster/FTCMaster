export const Setup = (teamData, teamMap) => {
    let points = [];
    let totalQuals = 0;
    let totalPlayoffs = 0;
    let totalQualPoints = 0;
    let totalPlayoffPoints = 0;
    let totalRP = 0;
    let performance = {
        wins: 0,
        losses: 0,
        ties: 0
    };
        
    for (const event of teamData.events) {    
        const qualMatches = event.matches.filter(match => 
            match.tournamentLevel == "QUALIFICATION" &&
            match.teams.some(team => team.teamNumber === teamData.info.number)
        );
        event.qualMatches = qualMatches;

        
        for (const qMatch of qualMatches) {
            for (const team of qMatch.teams) {
                if (team.teamNumber == teamData.info.number) {
                    let station = team.station;

                    if (station == "Red1" || station == "Red2") {
                        qMatch.alliance = "Red";
                    } else if (station == "Blue1" || station == "Blue2") {
                        qMatch.alliance = "Blue";
                    }
                }
                team.name = teamMap.get(team.teamNumber);
            }
            // RP
            let scoreDetails = event.qualScores.find(qualScore => qualScore.matchNumber == qMatch.matchNumber);
            let blueAlliance = scoreDetails.find(alliance => alliance.alliance == "Blue") || null;
            let redAlliance = scoreDetails.find(alliance => alliance.alliance == "Red") || null;

            if (blueAlliance == null || redAlliance == null) {
                console.warn("Invalid blue alliance or red alliance");
            }

            let blueRP = 0;
            let redRP = 0;
            if (blueAlliance.movementRP) { blueRP++; }
            if (blueAlliance.patternRP) { blueRP++; }
            if (blueAlliance.goalRP) { blueRP++; }

            if (redAlliance.movementRP) { redRP++; }
            if (redAlliance.patternRP) { redRP++; }
            if (redAlliance.goalRP) { redRP++; }

            if (qMatch.scoreBlueFinal > qMatch.scoreRedFinal) {
                blueRP += 3;
            } else if (qMatch.scoreRedFinal > qMatch.scoreBlueFinal) {
                redRP += 3;
            } else {
                blueRP++;
                redRP++;
            }
            qMatch.blueRP = blueRP;
            qMatch.redRP = redRP; 
            
            let point;
            if (qMatch.alliance == "Red") {
                point = qMatch.scoreRedFinal;
                totalRP += redRP;
            } else {
                point = qMatch.scoreBlueFinal;
                totalRP += blueRP;
            }
            
            totalQualPoints += point;
            points.push(point);
        }
        event.rp = totalRP / qualMatches.length;

        const playoffMatches = event.matches.filter(match => 
            match.tournamentLevel == "PLAYOFF" &&
            match.teams.some(team => team.teamNumber === teamData.info.number)
        );
        event.playoffMatches = playoffMatches;

        for (const pMatch of playoffMatches) {
            for (const team of pMatch.teams) {
                if (team.teamNumber == teamData.info.number) {
                    let station = team.station;

                    if (station == "Red1" || station == "Red2") {
                        pMatch.alliance = "Red";
                    } else if (station == "Blue1" || station == "Blue2") {
                        pMatch.alliance = "Blue";
                    }
                }
                team.name = teamMap.get(team.teamNumber);
            }

            if (qMatch.alliance == "Red") {
                totalPlayoffPoints += qMatch.scoreRedFinal;
            } else {
                totalPlayoffPoints += qMatch.scoreBlueFinal;
            }
        } 
        totalQuals += qualMatches.length;
        totalPlayoffs += playoffMatches.length;

        for (const rank of event.rankings) {
            console.log(rank);
            if (rank.number == teamData.number) {
                performance.wins = rank.wins;
                performance.losses = rank.losses;
                performance.ties = rank.ties;
            }

        }
    }

    teamData.pointAverage = Math.round(totalQualPoints / totalQuals);
    teamData.pointAveragePlayoff = Math.round(totalPlayoffPoints / totalPlayoffs);
    teamData.points = points;
    teamData.performance = performance;
    
    return teamData;
}