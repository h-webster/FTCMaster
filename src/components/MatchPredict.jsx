import { useState } from "react";

export default function MatchPredictor() {
    const [redTeams, setRedTeams] = useState("");
    const [blueTeams, setBlueTeams] = useState("");
    return (
        <div className="match-predict">
            <h2>Match Predictor</h2>
            <label>Red Teams</label>
        </div>       
    );
}