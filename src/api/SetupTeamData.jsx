export const Setup = (teamData, teamMap) => {
    let points = [];
    let totalQuals = 0;
    let totalPlayoffs = 0;
    let totalQualPoints = 0;
    let totalPlayoffPoints = 0;
        
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

            let point;
            if (qMatch.alliance == "Red") {
                point = qMatch.scoreRedFinal;
            } else {
                point = qMatch.scoreBlueFinal;
            }
            
            totalQualPoints += point;
            points.push(point);
        }
        
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

    }

    teamData.pointAverage = totalQualPoints / totalQuals;
    teamData.pointAveragePlayoff = totalPlayoffPoints / totalPlayoffs;
    teamData.points = points;
    
    return teamData;
}