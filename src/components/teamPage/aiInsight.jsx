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
        extraDataExtraction();
    }

    return (
        <div className='ai-insight'>
            { aiRequestStatus == null ? (
                <button className="generate-ai" onClick={generateAiInsight}>Generate AI Insight</button>
            ) : ( aiRequestStatus.loading ) ? (
                <h2>AI Insight Loading...</h2>
            ) : ( !aiRequestStatus.loading ) ? (
                <h2>{aiRequestStatus.data.analysis.summary}</h2>
            ) : (
                <h2>What</h2>
            )}
        </div>
    );
}