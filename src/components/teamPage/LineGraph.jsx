import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
//import '../App.css';

export const PointsGraph = ({data}) => {
    console.log(data);
    if (data.length == 0) {
      return;
    }

    const chartData = data.map((points, index) => ({
        matchNumber: index + 1,
        points: points
    }));
    const chartDataWithFit = getBestFitLine(chartData);
  
  return (
    <div className="outer-line-graph">
      <h2 className="line-graph-title">Points Over Time</h2>
      { data.length == 0 ? (
        <h3>No matches played</h3>
      ) : (
        <div className='line-graph'>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart
              data={chartDataWithFit}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 20,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="matchNumber" 
                stroke="#666"
                fontSize={12}
                label={{ value: 'Match Number', position: 'insideBottom', offset: -10 }}
              />
              <YAxis 
                stroke="#666"
                fontSize={12}
                label={{ value: 'Points', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#f8f9fa',
                  border: '1px solid #dee2e6',
                  borderRadius: '4px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="points" 
                stroke="#8884d8" 
                strokeWidth={3}
                dot={{ fill: '#8884d8', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="linear"
                dataKey="bestFit"
                stroke="#ff7300"
                strokeWidth={2}
                dot={false}
                tooltipType="none"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

      )}
    </div>
  );
};

const getBestFitLine = (data) => {
  const n = data.length;
  let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;

  data.forEach(d => {
    sumX += d.matchNumber;
    sumY += d.points;
    sumXY += d.matchNumber * d.points;
    sumXX += d.matchNumber * d.matchNumber;
  });

  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  return data.map(d => ({
    ...d,
    bestFit: slope * d.matchNumber + intercept
  }));
};
