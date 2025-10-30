import { useAdminTeamExtraction } from "../api/AdminTeamExtraction";
import { useAdminEventExtraction } from "../api/AdminEventExtraction";
import './Admin.css';
export default function Admin() {
    const { massTeamExtraction } = useAdminTeamExtraction();
    const { massEventExtraction } = useAdminEventExtraction();

    const fetchTeamSearch = async () => {
        console.log("Starting bulk fetch of all teams");
        await massTeamExtraction();
    }

    const fetchEventSearch = async () => {
        console.log("Starting bulk fetch of all events");
        await massEventExtraction();
    }

    return (
        <div className="admin-buttons">
            <button onClick={fetchTeamSearch}>Fetch Team Search</button>
            <button onClick={fetchEventSearch}>Fetch Event Search</button>
        </div>
    );
}