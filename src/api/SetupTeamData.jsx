export const Setup = (teamData, teamMap) => {
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
        }

        const playoffMatches = event.matches.filter(match => 
            match.tournamentLevel == "PLAYOFF" &&
            match.teams.some(team => team.teamNumber === teamData.info.number)
        );
        event.playoffMatches = playoffMatches;
    }
    
    return teamData;
}