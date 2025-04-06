import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Typography, Box, useTheme } from '@mui/material';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
const STATUS_COLORS = {
  'Needs Improvement': '#0088FE',    // Blue
  'Highly Successful': '#00C49F',    // Green
  'Moderately Successful': '#FFBB28' // Yellow
};

const PredictionPieChart = ({ data }) => {
  const theme = useTheme();
  
  // Filter out items with null predictions and count statuses
  const statusCounts = data.reduce((acc, curr) => {
    if (curr.prediction && curr.prediction.Prediction_Status) {
      const status = curr.prediction.Prediction_Status;
      acc[status] = (acc[status] || 0) + 1;
    }
    return acc;
  }, {});

  const pieData = Object.entries(statusCounts).map(([name, value]) => ({
    name,
    value,
    percentage: ((value / data.length) * 100).toFixed(1),
    color: STATUS_COLORS[name]  // Add color to the data
  }));

  if (pieData.length === 0) {
    return (
      <Typography variant="h6" color="error">
        No prediction status data available
      </Typography>
    );
  }

  return (
    <Box sx={{ 
      height: "100%",
      display: "flex",
      flexDirection: "column"
    }}>
      {/* Chart section */}
      <Box sx={{ flex: "1 1 auto", minHeight: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={2}
              label={({
                cx,
                cy,
                midAngle,
                innerRadius,
                outerRadius,
                percent,
              }) => {
                const RADIAN = Math.PI / 180;
                const radius = outerRadius + 20;
                const x = cx + radius * Math.cos(-midAngle * RADIAN);
                const y = cy + radius * Math.sin(-midAngle * RADIAN);

                return (
                  <text
                    x={x}
                    y={y}
                    fill={theme.palette.secondary[500]}
                    textAnchor={x > cx ? 'start' : 'end'}
                    dominantBaseline="central"
                    fontSize="12px"
                    fontWeight="500"
                  >
                    {`${(percent * 100).toFixed(1)}%`}
                  </text>
                );
              }}
              labelLine={{
                stroke: theme.palette.secondary[300],
                strokeWidth: 1,
                type: "polyline"
              }}
            >
              {pieData.map((entry) => (
                <Cell 
                  key={`cell-${entry.name}`} 
                  fill={entry.color}
                />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value, name) => [
                `${value} campaigns (${(value/data.length*100).toFixed(1)}%)`,
                name
              ]}
              contentStyle={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                border: '1px solid #ccc',
                borderRadius: '4px',
                padding: '8px'
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </Box>

      {/* Legend section */}
      <Box sx={{ 
        mt: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        pt: 1
      }}>
        {Object.entries(STATUS_COLORS).map(([status, color]) => (
          <Box 
            key={status} 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              mb: 1,
              width: '100%',
              justifyContent: 'center'
            }}
          >
            <Box
              sx={{
                width: 16,
                height: 16,
                backgroundColor: color,
                borderRadius: '4px',
                mr: 1,
                flexShrink: 0
              }}
            />
            <Typography 
              variant="body2" 
              color={theme.palette.secondary[500]}
              sx={{ whiteSpace: 'nowrap' }}
            >
              {status}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default PredictionPieChart; 