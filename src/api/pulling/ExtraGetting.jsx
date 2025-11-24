import { useData } from "../../contexts/DataContext";

export const useExtraGetting = () => {
    const { teamData } = useData();
    const extraDataExtraction = async (teamNum) => {
        console.log(`Getting extra data for team ${teamNum}...`);
    }

    const formatForAI = () => {
        let formatted = {
            teamInfo: {
                name: teamData.name,
            },

            name: teamData.name
        };
    }
    return { extraDataExtraction };
};