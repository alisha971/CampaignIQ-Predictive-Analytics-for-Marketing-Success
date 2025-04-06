import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useTheme } from '@mui/material/styles';

const PredictionBarChart = ({ data }) => {
  console.log("Bar Chart Raw Data:", data);
  
  // Filter out items with null predictions
  const validData = data.filter(item => item.prediction != null);
  console.log("Bar Chart Valid Data:", validData);

  const theme = useTheme();

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart 
        data={validData}
        margin={{
          top: 20,
          right: 50,
          left: 30,
          bottom: 40
        }}
        barGap={20}
        barCategoryGap={30}
        barSize={15}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="campaign.Campaign_ID" 
          label={{ 
            value: 'Campaign ID', 
            position: 'bottom',
            offset: 0,
            style: { textAnchor: 'middle' }
          }}
          tick={{ fontSize: 12 }}
          angle={-45}
          textAnchor="end"
          height={60}
        />
        {/* Left Y-axis for ROI */}
        <YAxis 
          yAxisId="left"
          label={{ 
            value: 'ROI', 
            angle: -90, 
            position: 'insideLeft',
            style: { 
              textAnchor: 'middle',
              fill: theme.palette.secondary[500]
            }
          }}
          tick={{ 
            fontSize: 12,
            fill: theme.palette.secondary[500]
          }}
          tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
        />
        {/* Right Y-axis for Clicks */}
        <YAxis 
          yAxisId="right"
          orientation="right"
          label={{ 
            value: 'Clicks', 
            angle: 90, 
            position: 'insideRight',
            style: { textAnchor: 'middle' }
          }}
          tick={{ fontSize: 12 }}
        />
        <Tooltip 
          formatter={(value, name) => {
            if (name === "Predicted ROI") {
              return [`${(value * 100).toFixed(1)}%`, name];
            }
            return [value, name];
          }}
          labelFormatter={(label) => `Campaign ID: ${label}`}
          contentStyle={{
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            border: '1px solid #ccc',
            borderRadius: '4px',
            padding: '10px'
          }}
        />
        <Legend 
          verticalAlign="top"
          height={36}
          wrapperStyle={{
            paddingBottom: '20px'
          }}
        />
        <Bar 
          yAxisId="left"
          dataKey="prediction.predicted_roi" 
          fill="#8884d8" 
          name="Predicted ROI"
          radius={[4, 4, 0, 0]}
        />
        <Bar 
          yAxisId="right"
          dataKey="prediction.predicted_engagement.clicks" 
          fill="#ffc658" 
          name="Predicted Clicks"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default PredictionBarChart; 