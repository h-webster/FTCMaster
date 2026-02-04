import { useState, useEffect } from "react";
import TeamSelectInput from "./TeamSelectInput";
import { handlePredict } from "../api/ml/matchPredict";
import './MatchPredict.css';
import Header from "./Header";
import { Analytics } from "@vercel/analytics/react";
import { useData } from "../contexts/DataContext";
import { getActiveTeamList, getTeamList } from "../api/pulling/TeamList";
import { createActiveAutocomplete, createAutocomplete, haveActiveAutocomplete } from "../TeamSearch";
import LoadingScreen from "./LoadingScreen";

export default function MatchPredictor({ comingSoon }) {
  const [redTeams, setRedTeams] = useState([null, null]);
  const [blueTeams, setBlueTeams] = useState([null, null]);
  const [result, setResult] = useState(null);
  
  const { loadingTeamList, setLoadingTeamList, teamList, setTeamList, loading, setLoading, setLoadingStatus } = useData();

  const predict = async () => {
    setLoading(true);
    setLoadingStatus("Predicting match...");
    const res = await handlePredict(redTeams, blueTeams);
    setLoading(false);
    console.log(res);
    setResult(res);
  };

  const onClear = (type) => {
    switch (type) {
      case 1:
        setRedTeams([null, redTeams[1]]);
        break;
      case 2:
        setRedTeams([redTeams[0], null]);
        break;
      case 3:
        setBlueTeams([null, blueTeams[1]]);
        break;
      case 4:
        setBlueTeams([blueTeams[0], null]);
        break;
      default:
        console.error("Invalid type for onClear.");
        break;
    }
  }
  useEffect(() => {
    if (teamList == undefined || teamList.length == 0) {
      setLoadingTeamList(true);
      const fetchTeams = async () => {
        const data = await getTeamList();
        const activeData = await getActiveTeamList(data);
        console.log(activeData);
        setTeamList(data);
        createAutocomplete(data);
        createActiveAutocomplete(activeData);
        setLoadingTeamList(false);
      }
      fetchTeams();
    } else if (!haveActiveAutocomplete()) {
      const fetchActiveTeamList = async () => {
        const activeData = await getActiveTeamList(data);
        console.log(activeData);
        createActiveAutocomplete(activeData);
      }
      fetchActiveTeamList();
    }
  }, []);
  if (loading) {
    return <LoadingScreen/>
  }
  return (
    <>
      <Header />
      <div className="match-predict">
        <div className="card">
          <h2 className="predict-title">Match Predictor</h2>

          {comingSoon ? (
            <h3>Coming soon</h3>
          ) : (
            <div className="predict-display">
              <div className="sides">
                <div className="side red">
                  <h3 className="red">Red Alliance</h3>
                  <TeamSelectInput
                    value={redTeams[0]}
                    onSelect={n => setRedTeams([n, redTeams[1]])}
                    onClear={() => onClear(1)}
                  />
                  <TeamSelectInput
                    value={redTeams[1]}
                    onSelect={n => setRedTeams([redTeams[0], n])}
                    onClear={() => onClear(2)}
                  />
                </div>

                <h3 className="vs">vs</h3>

                <div className="side">
                  <h3 className="blue">Blue Alliance</h3>
                  <TeamSelectInput
                    value={blueTeams[0]}
                    onSelect={n => setBlueTeams([n, blueTeams[1]])}
                    onClear={() => onClear(3)}
                  />
                  <TeamSelectInput
                    value={blueTeams[1]}
                    onSelect={n => setBlueTeams([blueTeams[0], n])}
                    onClear={() => onClear(4)}
                  />
                </div>
              </div>

              <button
                disabled={[...redTeams, ...blueTeams].includes(null)}
                onClick={predict}
                className="predict"
              >
                Predict Match
              </button>

              { result && 
                <>
                  <hr/>
                  <div className="results">
                    <h2>Predicted Winner: <span className={result.winner == "Red" ? "red" : "blue"}> {result.winner}</span></h2>
                    <div className="chances">
                      <h3 className="redChance"><span className="red">Red's</span> chance to win: <span className="red">{(result.probabilities.Red * 100).toFixed(1)}%</span></h3>
                      <h3 className="blueChance"><span className="blue">Blue's</span> chance to win: <span className="blue">{(result.probabilities.Blue * 100).toFixed(1)}%</span></h3>
                    </div>
                  </div>
              </>
              }
            </div>
          )}
        </div>
      </div>
      <Analytics />
    </>
  );
  
}
