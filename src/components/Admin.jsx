import { useAdminTeamExtraction } from "../api/AdminTeamExtraction";
import { useAdminEventExtraction } from "../api/AdminEventExtraction";
import { useAdminOPRExtraction } from "../api/AdminOPRExtraction";
import { clearCache } from "../api/pulling/TeamCache";
import './Admin.css';

export default function Admin() {
    const { massTeamExtraction } = useAdminTeamExtraction();
    const { massEventExtraction } = useAdminEventExtraction();
    const { massOPRExtraction } = useAdminOPRExtraction();


    const fetchTeamSearch = async () => {
        console.log("Starting bulk fetch of all teams");
        await massTeamExtraction();
    }

    const fetchEventSearch = async () => {
        console.log("Starting bulk fetch of all events");
        await massEventExtraction();
    }

    const clearTeamCache = async () => {
        console.log("Clearing team cache");
        await clearCache();
    }

    const fetchOPRSearch = async () => {
        console.log("Starting fetch of opr");
        massOPRExtraction();
    }
    return (
        <div className="admin-buttons">
            <button onClick={fetchTeamSearch}>Fetch Team Search</button>
            <button onClick={fetchEventSearch}>Fetch Event Search</button>
            <button onClick={clearTeamCache}>Clear Team Cache</button>
            <button onClick={fetchOPRSearch}>Fetch OPR</button>
        </div>
    );
}