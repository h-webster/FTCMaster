import { useData } from "../contexts/DataContext";
import LoadingScreen from "./LoadingScreen";
import { useTeamGetting } from "../api/getting/TeamGetting";
export default function Team() {
    const {loading} = useData();
    const { number } = useParams();
    const { teamExtraction } = useTeamGetting();

    useEffect(() => {
        // Fetch team data based on team number
        console.log(`Fetching data for team ${number}...`);
        teamExtraction(number);
    }, [number]);
    
    if (loading) {
        return <LoadingScreen/>;
    }
    return (
        <>
            <h1>Team Page</h1>
        </>
    );
}