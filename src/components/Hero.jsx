import './Hero.css';

export default function Hero() {
    return (
        <div className="hero">
            <h1 className='title'>FTCMaster</h1>
            <h2>Your FTC Scouting and Analysis Companion</h2>
            <div className="buttons">
                <button className='lookup'>Team Lookup</button>
            </div>
        </div>
    )
}