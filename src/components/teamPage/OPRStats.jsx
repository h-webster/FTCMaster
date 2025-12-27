import { Ordinalize } from "../../utils/Fancy";

export const OPRStats = ({ data }) => {
    if (data.opr == null) {
        return (
            <div className="chart-card">
                <h2>Best OPR Stats</h2>

            </div>
        )
    } 
    return (
        <div className='chart-card'>
            <h2>Best OPR Stats</h2>
            { (data.opr == null || !('tot' in data.opr)) ? (
                <div className="quick-stats">
                    No opr stats
                </div>
            ) : (
                <div className="quick-stats">
                    <div className="quick-stat">
                        <h3 className='quick-stat-title'>Total NP: {data.opr.tot.value.toFixed(2)}</h3>
                        <p className='quick-stat-desc'>{Ordinalize(data.opr.tot.rank)} / {data.opr.count}</p>
                    </div>
                    <div className="quick-stat">
                        <h3 className='quick-stat-title'>Auto: {data.opr.auto.value.toFixed(2)}</h3>
                        <p className='quick-stat-desc'>{Ordinalize(data.opr.auto.rank)} / {data.opr.count}</p>
                    </div>
                    <div className="quick-stat">
                        <h3 className='quick-stat-title'>Teleop: {data.opr.teleop.value.toFixed(2)}</h3>
                        <p className='quick-stat-desc'>{Ordinalize(data.opr.teleop.rank)} / {data.opr.count}</p>
                    </div>
                    <div className="quick-stat">
                        <h3 className='quick-stat-title'>Endgame: {data.opr.endgame.value.toFixed(2)}</h3>
                        <p className='quick-stat-desc'>{Ordinalize(data.opr.endgame.rank)} / {data.opr.count}</p>
                    </div>
                </div>
            )}
            
        </div>
    );
};