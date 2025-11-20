import { PointsGraph } from './LineGraph';
import './TeamCharts.css';
import { useData } from '../../contexts/DataContext';
import { PieGraph } from './PieGraph';
import { OPRStats } from './OPRStats';

const COLORS = ['#4caf50', '#f44336', '#ffeb3b'];

export const TeamCharts = () => {
    const { teamData } = useData();

    return (
        <div className="charts-container">
            <OPRStats data={teamData}/>
            <PieGraph data={teamData.performance}/>
            <PointsGraph data={teamData.points}/>
        </div>
    );
};