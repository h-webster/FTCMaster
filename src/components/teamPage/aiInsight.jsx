import { useEffect } from "react";
import { useData } from "../../contexts/DataContext";
import './aiInsight.css';
import { useExtraGetting } from "../../api/pulling/ExtraGetting";
export default function AIInsight() {
    const { loadingExtras, aiRequestStatus, setAiRequestStatus, teamData } = useData();
    const { extraDataExtraction } = useExtraGetting();
    
    const generateAiInsight = () => {
        setAiRequestStatus({
            number: teamData.number,
            loading: true,
        });
        extraDataExtraction(teamData.number);
    }

    return (
        <div className='ai-insight'>
            { aiRequestStatus == null ? (
                <button className="generate-ai" onClick={generateAiInsight}>Generate AI Insight</button>
            ) : ( aiRequestStatus.loading ) ? (
                <h2>AI Insight Loading...</h2>
            ) : ( !aiRequestStatus.loading ) ? (
                <div className='ai-insight-card'>
                    <div className='ai-insight-header'>
                        <h2>AI Insight</h2>
                        <img alt="Insight Icon" class="insight-icon" width="30" height="30" src="/insight.png"/>
                    </div>
                    <div className="ai-insight-content">
                        <div className="ai-insight-data">
                            <div className="ai-score-section">
                                <div className="ai-score"></div>
                            </div>
                            <div className="ai-analysis-section">
                                <div className="strength-section">
                                    <h3 className="section-title">Strengths</h3>
                                    <div className="section-content strengths">
                                        
                                    </div>
                                </div>
                                <div className="weakness-section">
                                    <h3 className="section-title">Areas for Improvement</h3>
                                    <div className="section-content weaknesses">
                                        
                                    </div>
                                </div>
                            </div>
                        </div>
                        <h2>{aiRequestStatus.data.analysis.summary}</h2>
                    </div>
                </div>
            ) : (
                <h2>What</h2>
            )}
        </div>
    );
}