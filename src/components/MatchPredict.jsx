import { useState } from "react";
import './MatchPredict.css';
import { handlePredict } from "../api/ml/matchPredict";
export default function MatchPredictor() {
    const [redTeams, setRedTeams] = useState("");
    const [blueTeams, setBlueTeams] = useState("");
    const [result, setResult] = useState(null);

    const handlePredictClick = async () => {
        const prediction = await handlePredict(redTeams, blueTeams);
        setResult(prediction);
        console.log(prediction);
    }
    return (
        <>
            <div className="match-predict">
                <h2 className="predict-title">Match Predictor</h2>
                <label>Red Teams</label>
                <input 
                    type="text"
                    value={redTeams}
                    onChange={e => setRedTeams(e.target.value)}
                />
                <label>Blue Teams</label>
                <input 
                    type="text"
                    value={blueTeams}
                    onChange={e => setBlueTeams(e.target.value)}
                />
                <button onClick={handlePredictClick}>Predict Match</button>
            </div>
        </>       
    );
}