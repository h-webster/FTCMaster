import { PointsGraph } from './LineGraph';
import './TeamCharts.css';
import { useData } from '../../contexts/DataContext';
import { PieGraph } from './PieGraph';

const COLORS = ['#4caf50', '#f44336', '#ffeb3b'];

export const TeamCharts = () => {
    const { teamData } = useData();

    return (
        <div className="charts-container">
            <PieGraph data={teamData.performance}/>
            <PieGraph data={teamData.performance}/>
            <PointsGraph data={teamData.points}/>
        </div>
    );
};