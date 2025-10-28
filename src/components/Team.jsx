import { useData } from "../contexts/DataContext";
import LoadingScreen from "./LoadingScreen";
export default function Team() {
    const {loading} = useData();
    const { number } = useParams();

    useEffect(() => {
        // Fetch team data based on team number
        console.log(`Fetching data for team ${number}...`);
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