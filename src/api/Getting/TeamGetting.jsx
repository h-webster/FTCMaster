import { useEffect, useState } from "react";
import { useData } from "../../contexts/DataContext";
import { getTeamList } from "./TeamList";
import { getEventsByTeamNumber } from "./Events";

export const useTeamGetting = () => {
    const { teamList, setTeamList, setTeamData } = useData();
    const [teamNumber, setTeamNumber] = useState(0);
    const [events, setEvents] = useState(['null']);
    // steps: teamNumber -> teamList -> events -> setTeamData
    const teamExtraction = async (teamNum) => {
        console.log(`Getting team ${teamNum}...`);
        setTeamNumber(teamNum);
    }
    const teamListPull = async () => {
        if (teamList == undefined || teamList.length == 0) {
            const data = await getTeamList();
            setTeamList(data);
        } else {
            await getEvents();
        }
    }
    const eventsPull = async () => {
        const eventData = await getEventsByTeamNumber(teamNumber);
        setEvents(eventData);
    }
    const finalizeTeamData = () => {
        const newTeamData = {
            version: 1,
            number: teamNumber,
            events: events
        }
        setTeamData(newTeamData);
    }
    useEffect(() => {
        if (teamNumber != 0 || teamNumber != undefined) {
            teamListPull();
        }
    }, [teamNumber])
    useEffect(() => {
        if (teamList != undefined && teamList.length > 0) {
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