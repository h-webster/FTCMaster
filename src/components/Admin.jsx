import { useAdminExtraction } from "../api/AdminTeamExtraction";
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
        <>
            <button onClick={fetchTeamSearch}>Fetch Team Search</button>
            <button onClick={fetch}
        </>
    );
}