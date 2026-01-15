import { useState } from "react";
import TeamSelectInput from "./TeamSelectInput";
import { handlePredict } from "../api/ml/matchPredict";
import './MatchPredict.css';

export default function MatchPredictor({ comingSoon }) {
  const [redTeams, setRedTeams] = useState([null, null]);
  const [blueTeams, setBlueTeams] = useState([null, null]);
  const [result, setResult] = useState(null);

  const predict = async () => {
    const res = await handlePredict(redTeams, blueTeams);
    console.log(res);
    setResult(res);
  };

  if (comingSoon) return <h3>Coming Soon</h3>;

  return (
    <div className="match-predict">
      <h2>Match Predictor</h2>
      <div className="sides">
        <div className="side">
          <h3>Red Alliance</h3>
          <TeamSelectInput
            value={redTeams[0]}
            onSelect={n => setRedTeams([n, redTeams[1]])}
            onClear={() => setRedTeams([null, redTeams[1]])}
          />
          <TeamSelectInput
            value={redTeams[1]}
            onSelect={n => setRedTeams([redTeams[0], n])}
            onClear={() => setRedTeams([redTeams[0], null])}
          />
        </div>
        <h3 className="vs">vs</h3>
        <div className="side">
          <h3>Blue Alliance</h3>
          <TeamSelectInput
            value={blueTeams[0]}
            onSelect={n => setBlueTeams([n, blueTeams[1]])}
            onClear={() => setBlueTeams([null, blueTeams[1]])}
          />
          <TeamSelectInput
            value={blueTeams[1]}
            onSelect={n => setBlueTeams([blueTeams[0], n])}
            onClear={() => setBlueTeams([blueTeams[0], null])}
          />
        </div>
      </div>
      

      <button
        disabled={[...redTeams, ...blueTeams].includes(null)}
        onClick={predict}
      >
        Predict Match
      </button>

    </div>
  );
}
