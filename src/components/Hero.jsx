import { useNavigate } from 'react-router-dom';
import './Hero.css';

export default function Hero() {
    const navigate = useNavigate();
    const goLookup = () => {
        navigate('/lookup');
    }
    const goPredict = () => {
        navigate('/predict');
    }
    return (
        <div className="hero">
            <h1 className='title'>FTCMaster</h1>
            <h2>Your FTC Scouting and Analysis Companion</h2>
            <div className="buttons">
                <button onClick={goLookup} className='lookup'>Team Lookup</button>
                <button onClick={goPredict} className='predict'>Match Predictor</button>
            </div>
        </div>
    )
}