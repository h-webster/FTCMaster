import { useAdminExtraction } from "../api/AdminExtraction";
export default function Admin() {
    const { massTeamExtraction } = useAdminExtraction();

    const fetchTeamSearch = async () => {
        console.log("Starting bulk fetch of all teams");
        await massTeamExtraction();
    }

    return (
        <>
            <button onClick={fetchTeamSearch}>Fetch Team Search</button>
        </>
    );
}