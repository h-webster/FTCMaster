import { useData } from "../../contexts/DataContext";

export const useExtraGetting = () => {
    const { teamData } = useData();
    const extraDataExtraction = async (teamNum) => {
        console.log(`Getting extra data for team ${teamNum}...`);
        formatForAI();
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
                events.push(...event.matches);
            }
        }
        formatted.events = events;
        let removedFormatted = removeFieldsJSON(formatted, "_id");
        removedFormatted = removeFieldsJSON(removedFormatted, "__v");
        console.log(removedFormatted);
    }
    return { extraDataExtraction };
};