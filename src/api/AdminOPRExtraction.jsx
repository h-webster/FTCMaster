import { useData } from "../contexts/DataContext";
import { getTeamOPR } from "./pulling/OPR";
const API_BASE_URL = process.env.NODE_ENV === 'production' ? 'https://ftcmasterbackend.vercel.app/api' : 'http://localhost:5000/api';
export const useAdminOPRExtraction = () => {
    const { setLoading, setLoadingStatus } = useData();
    const massOPRExtraction = async () => {
        setLoading(true);
        setLoadingStatus("Starting mass OPR extraction...");

        try {
            await getTeamOPR(27821);
        } catch (error) {
            console.error("Error fetching OPR data:", error);
        } finally {
            setLoading(false);
        }
    }
    return { massOPRExtraction };
}