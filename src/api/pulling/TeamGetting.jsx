import { useEffect, useState } from "react";
import { useData } from "../../contexts/DataContext";
import { getTeamList } from "./TeamList";
import { getTeam } from "./TeamCache";
import { getEventsByTeamNumber } from "./Events";
import { Setup } from "../SetupTeamData";
import { getOPR } from "./OPR";

export const useTeamGetting = () => {
    const { teamList, setTeamList, teamData, setTeamData, teamMap, setTeamMap, setLoadingTeamList, setAiRequestStatus } = useData();
    const [teamNumber, setTeamNumber] = useState(0);
    const [teamCache, setTeamCache] = useState();
    const [opr, setOPR] = useState();
    const [events, setEvents] = useState(['null']);
    // steps: teamNumber -> check cache -> reset team data -> teamList -> teamMap -> opr -> events -> finalizeTeamData -> setTeamData
    const teamExtraction = async (teamNum) => {
        console.log(`Getting team ${teamNum}...`);
        setTeamNumber(teamNum);
    }
    const teamCachePull = async () => {
        const team = await getTeam(teamNumber);
        if (team == null) {
            console.log("Team not found in cache!");
            resetTeamData();
        } else {
            console.log("Team found in cache!");
            console.log(team);
            if ('analysis' in team) {
                setAiRequestStatus({
                    number: teamNumber,
                    loading: false,
                    data: team,
                    preloaded: true
                });
            }
            setTeamData(team);
        }
    }
    const resetTeamData = () => {
        setTeamData(null);
        console.log("RESET TEAM DATA");
    }
    const teamListPull = async () => {
        if (teamList == undefined || teamList.length == 0) {
            const data = await getTeamList();
            setTeamList(data);
        } else {
            teamMapPull();
        }
    }
    const oprPull = async () => {
        const oprData = await getOPR(teamNumber);
        console.log(JSON.stringify(oprData));
        setOPR(oprData);
    }
    const teamMapPull = () => {
        const teamsMap = new Map(teamList.map(team => [team.number, team.name]));
        setTeamMap(teamsMap);
    }
    const eventsPull = async () => {
        const eventData = await getEventsByTeamNumber(teamNumber);
        setEvents(eventData);
    }
    const finalizeTeamData = () => {
        console.log("Finalize");
        const teamInfo = teamList.find(team => team.number == teamNumber);
        const newTeamData = {
            version: 1,
            number: teamNumber,
            info: teamInfo,
            events: events,
            opr: opr,  
        };
        Setup(newTeamData, teamMap);
        setTeamData(newTeamData);
    }
    useEffect(() => {
        console.log(teamNumber);
        if (teamNumber != 0 && teamNumber != undefined) {
            console.log("running team cache");
            teamCachePull();
        }
        console.log("aa");
    }, [teamNumber])
    useEffect(() => {
        if (teamData == null) {
            console.log("LIST PULLLL");
            teamListPull();
        }
    }, [teamData])
    useEffect(() => {
        if (teamList != undefined && teamList.length > 0 && teamNumber != 0) {
            setLoadingTeamList(false);
            teamMapPull();
        }  
    }, [teamList])
    useEffect(() => {
        if (teamMap != undefined && teamMap != null) {
            oprPull();
        }
    }, [teamMap])
    useEffect(() => {
        if (opr !== undefined) {
            eventsPull();
        }
    }, [opr])
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