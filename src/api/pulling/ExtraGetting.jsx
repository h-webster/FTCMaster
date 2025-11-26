import { useData } from "../../contexts/DataContext";
import { aiRequest } from "./openApi";

export const useExtraGetting = () => {
    const { teamData, setAiRequestStatus } = useData();
    const extraDataExtraction = async (teamNum) => {
        console.log(`Getting extra data for team ${teamNum}...`);
        let formattedTeamData = formatForAI();
        let aiResponse = await aiRequest(formattedTeamData);
        console.log("AI Response: " + JSON.stringify(aiResponse));
        setAiRequestStatus({
            number: teamNum,
            loading: false,
            data: aiResponse  
        })
    }

    const removeFieldsJSON = (obj, fieldName) => {
        const jsonString = JSON.stringify(obj, (key, value) => {
            if (key === fieldName) return undefined;
            return value;
        });
        return JSON.parse(jsonString);
    }

    const formatForAI = () => {
        let formatted = {
            info: teamData.info,
            performance: teamData.performance,
            opr: teamData.opr,
            pointAverage: teamData.pointAverage,
        };
        let events = [];
        for (let event of teamData.events) {
            if (event.matches.length > 0) {
                events.push(event.matches);
            }
        }
        formatted.events = events;
        let removedFormatted = removeFieldsJSON(formatted, "_id");
        removedFormatted = removeFieldsJSON(removedFormatted, "__v");
        console.log(removedFormatted);
        return removedFormatted;
    }
    return { extraDataExtraction };
};