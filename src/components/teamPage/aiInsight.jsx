import { useEffect } from "react";
import { useData } from "../../contexts/DataContext";
import './aiInsight.css';

export default function AIInsight() {
    const { loadingExtras, loading, extraData } = useData();

    return (
        <div className='ai-insight'>
            { loadingExtras ? (
                <h2>Loading AI Insights...</h2>
            ) : (
                <h2>AI Insight Component</h2>
            )}
        </div>
    );
}