import { Debug, Debug_Data } from "../../utils/Debug"
import { getEventsByTeamNumber } from "./Events";

export const useTeamPulling = () => {
    let team = {};
    const teamPull = async (teamNumber) => {
        team = {
            number: teamNumber
        };
        Debug("Starting team pull...");   
        const eventData = pullEvents();
    }
    const pullEvents = async () => {
        Debug("Pulling events...");
        if (!('number' in team)) {
            console.warn("No number exists in team!");
            return null;
        }
        const eventData = await getEventsByTeamNumber(teamNumber);
        Debug_Data("Event Data: " + JSON.stringify(eventData));
        for (let i = 0; i < eventData.length; i++) {
        }
        return eventData;
    }

    return {teamPull};
} 