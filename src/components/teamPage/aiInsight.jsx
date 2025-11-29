import { useEffect } from "react";
import { useData } from "../../contexts/DataContext";
import './aiInsight.css';
import { useExtraGetting } from "../../api/pulling/ExtraGetting";
export default function AIInsight() {
    const { loadingExtras, aiRequestStatus, setAiRequestStatus, teamData, error, setError } = useData();
    const { extraDataExtraction } = useExtraGetting();
    
    useEffect(() => {
        setError(null);
        setAiRequestStatus(null);
    }, []);
    const generateAiInsight = () => {
        setAiRequestStatus({
            number: teamData.number,
            loading: true,
        });
        extraDataExtraction(teamData.number);
    }
    const getScoreColor = (score) => {
        const numScore = parseFloat(score) || 0;
        if (numScore >= 8) return '#4caf50'; // Green
        if (numScore >= 6) return '#ff9800'; // Orange
        return '#f44336'; // Red
    };

    return (
        <div className='ai-insight'>
            { teamData.events.length == 0 ? (
                <h2>No ai insight for team</h2>
            ) : (aiRequestStatus == null) ? (
                <button className="generate-ai" onClick={generateAiInsight}>Generate AI Insight</button>
            ) : (error?.type == "ai") ? (
                <h2 className="error">{error.msg}</h2>
            ) : ( aiRequestStatus.loading ) ? (
                <h2>AI Insight Loading...</h2>
            ) : ( !aiRequestStatus.loading ) ? (
                <div className='ai-insight-card'>
                    <div className='ai-insight-header'>
                        <h2>AI Insight</h2>
                        <img alt="Insight Icon" className="insight-icon" width="30" height="30" src="/insight.png"/>
                    </div>
                    <div className="ai-insight-content">
                        <div className="ai-insight-data">
                            <div className="ai-score-section">
                                <h3 className="ai-score" style={{ color: getScoreColor(aiRequestStatus.data.analysis.score)}}>Score: {aiRequestStatus.data.analysis.score}/10</h3>
                                <p>{aiRequestStatus.data.analysis.summary}</p>
                            </div>
                            <div className="ai-analysis-section">
                                <div className="strength-section">
                                    <h3 className="section-title">Strengths</h3>
                                    <div className="section-content strengths">
                                        {aiRequestStatus.data.analysis.strengths.map((strength, id) => (
                                            <li key={id}>{strength}</li>
                                        ))}
                                    </div>
                                </div>
                                <div className="weakness-section">
                                    <h3 className="section-title">Areas for Improvement</h3>
                                    <div className="section-content weaknesses">
                                        {aiRequestStatus.data.analysis.weaknesses.map((weakness, id) => (
                                            <li key={id}>{weakness}</li>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <h2>What</h2>
            )}
        </div>
    );
}