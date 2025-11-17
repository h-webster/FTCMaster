import { PieChart, Pie, Cell } from 'recharts';
import './TeamCharts.css';

const COLORS = ['#4caf50', '#f44336', '#ffeb3b'];

export const PieGraph = ({ data }) => {
    const winLossData = [
        { name: "Wins", value: data.wins},
        { name: "Losses", value: data.losses},
        { name: "Ties", value: data.ties}
    ];
  return (
      <div className="chart-card">
        <h2>Win/Loss Ratio</h2>
        { data.wins == 0 && data.losses == 0 ? (
          <div className="full-lossrate">
            <div>No wins or losses</div>
          </div>
        ) : (
          <div className="win-loss-ratio">
            <PieChart width={200} height={200}>
              <Pie
                data={winLossData}
                cx={100}
                cy={100}
                innerRadius={50}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
              >
                {winLossData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
            <div>Wins: {data.wins}, Losses: {data.losses}, Ties: {data.ties}</div>
          </div>
        )}
      </div>
  );
};