import { useData } from "../../contexts/DataContext";
import { Debug, Debug_Data } from "../../utils/Debug";
import { aiRequest, getAI } from "./openApi";

export const useExtraGetting = () => {
    const { teamData, setAiRequestStatus, setError} = useData();
    const extraDataExtraction = async (teamNum) => {
        console.log(`Getting extra data for team ${teamNum}...`);
        let formattedTeamData = formatForAI();
        console.log(formattedTeamData);
        let aiResponse ="";
        try {
            aiResponse = await aiRequest(formattedTeamData);
            console.log("AI Response: " + JSON.stringify(aiResponse));
            setAiRequestStatus({
                number: teamNum,
                loading: false,
                data: aiResponse  
            })   
        } catch (error) {
            console.error(error.message);
            if (error.message === 'RATE_LIMIT_EXCEEDED' || error.statusCode === 429) {
                setError({
                    msg: 'Request limit reached. Please try again in an hour.',
                    type: "ai"
                });
            } else {
                setError({
                    msg: 'Failed to analyze team: ' + error.message,
                    type: "ai"
                })
            }
        }
        
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