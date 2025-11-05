import { useEffect, useState } from "react";
import { useData } from "../../contexts/DataContext";
import { getTeamList } from "./TeamList";
import { getTeam } from "./TeamCache";
import { getEventsByTeamNumber } from "./Events";

export const useTeamGetting = () => {
    const { teamList, setTeamList, setTeamData } = useData();
    const [teamNumber, setTeamNumber] = useState(0);
    const [teamCache, setTeamCache] = useState();
    const [events, setEvents] = useState(['null']);
    // steps: teamNumber -> check cache -> teamList -> teamInfo -> events -> setTeamData
    const teamExtraction = async (teamNum) => {
        console.log(`Getting team ${teamNum}...`);
        setTeamNumber(teamNum);
    }
    const teamCachePull = async () => {
        const team = await getTeam(teamNumber);
        if (team == null) {
            console.log("Team not found in cache!");
            await teamListPull();
        } else {
            console.log("Team found in cache!");
            console.log(JSON.stringify(team));
            setTeamData(team);
        }
    }
    const teamListPull = async () => {
        if (teamList == undefined || teamList.length == 0) {
            const data = await getTeamList();
            setTeamList(data);
        } else {
            await eventsPull();
        }
    }
    const eventsPull = async () => {
        const eventData = await getEventsByTeamNumber(teamNumber);
        setEvents(eventData);
    }
    const finalizeTeamData = () => {
        const teamInfo = teamList.find(team => team.number == teamNumber);
        const newTeamData = {
            version: 1,
            number: teamNumber,
            info: teamInfo,
            events: events
        }
        setTeamData(newTeamData);
    }
    useEffect(() => {
        if (teamNumber != 0 && teamNumber != undefined) {
            teamCachePull();
        }
    }, [teamNumber])
    useEffect(() => {
        if (teamList != undefined && teamList.length > 0 && teamNumber != 0) {
            eventsPull();
        }
    }, [teamList])
    useEffect(() => {
        if (events.length != 1) {
            finalizeTeamData();
        } else {
            if (events[0] !== 'null') {
                finalizeTeamData();
            }
        }
    }, [events])
    return { teamExtraction };
}