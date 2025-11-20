import { Ordinalize } from "../../utils/Fancy";

export const OPRStats = ({ data }) => {
    return (
        <div className='chart-card'>
            <h2>Best OPR Stats</h2>
            <div className="quick-stats">
                <div className="quick-stat">
                    {/* TOP PRIORITY MAKE COUNT AUTOMATIC*/}
                    <h3 className='quick-stat-title'>Total NP: {data.opr.tot.value.toFixed(2)}</h3>
                    <p className='quick-stat-desc'>{Ordinalize(data.opr.tot.rank)} / -1</p>
                </div>
                <div className="quick-stat">
                    <h3 className='quick-stat-title'>Auto: {data.opr.auto.value.toFixed(2)}</h3>
                    <p className='quick-stat-desc'>{Ordinalize(data.opr.auto.rank)} / -1</p>
                </div>
                <div className="quick-stat">
                    <h3 className='quick-stat-title'>Teleop: {data.opr.teleop.value.toFixed(2)}</h3>
                    <p className='quick-stat-desc'>{Ordinalize(data.opr.teleop.rank)} / -1</p>
                </div>
                <div className="quick-stat">
                    <h3 className='quick-stat-title'>Endgame: {data.opr.endgame.value.toFixed(2)}</h3>
                    <p className='quick-stat-desc'>{Ordinalize(data.opr.endgame.rank)} / -1</p>
                </div>
            </div>
        </div>
    );
};