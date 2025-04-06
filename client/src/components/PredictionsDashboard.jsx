import { Box, Typography, useTheme, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Card, Divider } from "@mui/material";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import PredictionBarChart from "./charts/PredictionBarChart";
import PredictionPieChart from "./charts/PredictionPieChart";
import FlexBetween from "./FlexBetween";
import { Refresh as RefreshIcon } from '@mui/icons-material';
import StatBox from "./StatBox";
import { 
  TrendingUp as ROIIcon,
  TouchApp as ClicksIcon,
  CompareArrows as ConversionIcon,
  Assessment as StatusIcon 
} from '@mui/icons-material';

const API_URL = import.meta.env.VITE_APP_BASE_URL || 'http://localhost:5001';

console.log('PredictionsDashboard module loaded');

const PredictionsDashboard = () => {
  console.log('PredictionsDashboard component function called');
  
  const [campaignInsights, setCampaignInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const theme = useTheme();
  const location = useLocation();

  console.log("PredictionsDashboard mounted, pathname:", location.pathname);

  useEffect(() => {
    console.log('Component mounted');
    return () => console.log('Component unmounted');
  }, []);

  const fetchData = async () => {
    console.log("Starting fetch...");
    setLoading(true);
    setError(null);
    
    try {
      const timestamp = new Date().getTime();
      const url = `${API_URL}/general/campaign-insights?t=${timestamp}`;
      console.log("Fetching from:", url);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      });

      // Add timeout to the fetch
      const timeoutId = setTimeout(() => {
        throw new Error('Request timed out after 5 seconds');
      }, 5000);

      console.log("Response status:", response.status);
      
      if (!response.ok) {
        const text = await response.text();
        console.error("Error response:", text);
        throw new Error(`HTTP error! status: ${response.status}, body: ${text}`);
      }

      const data = await response.json();
      clearTimeout(timeoutId);
      console.log("Data received:", data);
      setCampaignInsights(data);
    } catch (error) {
      console.error("Fetch error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch on mount
  useEffect(() => {
    console.log("Initial mount effect running");
    fetchData();
  }, []);

  // Fetch when location changes
  useEffect(() => {
    console.log("Location change effect running, pathname:", location.pathname);
    if (location.pathname === '/predictions') {
      fetchData();
    }
  }, [location.pathname]);

  // Add a button to manually trigger fetch for testing
  const handleRefresh = () => {
    console.log("Manual refresh triggered");
    fetchData();
  };

  console.log("Rendering PredictionsDashboard, state:", { 
    loading, 
    error, 
    dataLength: campaignInsights.length,
    pathname: location.pathname 
  });

  return (
    <Box m="1.5rem 2.5rem">
      <FlexBetween>
        <Box>
          <Typography
            variant="h4"
            color={theme.palette.secondary[400]}
            fontWeight="bold"
            sx={{ mb: "5px" }}
          >
            Campaign Predictions Dashboard
          </Typography>
          <Typography variant="h6" color={theme.palette.secondary[500]}>
            Overview of campaign performance predictions
          </Typography>
        </Box>
        <Button
          variant="contained"
          onClick={handleRefresh}
          startIcon={<RefreshIcon />}
          sx={{
            backgroundColor: theme.palette.secondary[300],
            color: theme.palette.background.alt,
            fontSize: "14px",
            fontWeight: "bold",
            padding: "10px 20px",
            '&:hover': {
              backgroundColor: theme.palette.secondary[100],
            }
          }}
        >
          Refresh Data
        </Button>
      </FlexBetween>

      {loading && (
        <Box m="20px" display="flex" alignItems="center" justifyContent="center">
          <Typography variant="h5" color={theme.palette.secondary[300]}>
            Loading campaign insights...
            <span style={{ display: 'inline-block', marginLeft: '10px' }}>
              ⌛
            </span>
          </Typography>
        </Box>
      )}

      {error && (
        <Box m="20px">
          <Typography color="error">Error: {error}</Typography>
        </Box>
      )}

      {!loading && !error && campaignInsights.length === 0 && (
        <Box m="20px">
          <Typography>No campaign data available</Typography>
        </Box>
      )}

      {!loading && !error && campaignInsights.length > 0 && (
        <>
          <Box
            mt="20px"
            display="grid"
            gridTemplateColumns="repeat(12, 1fr)"
            gap="20px"
            sx={{ mb: "60px" }}
          >
            {/* Bar Chart Card - Full Width */}
            <Card
              sx={{
                gridColumn: "span 12",  // Changed from span 8 to span 12
                backgroundColor: theme.palette.background.alt,
                p: "1.5rem",
                borderRadius: "0.75rem",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                height: "400px"  // Fixed height
              }}
            >
              <Typography 
                variant="h6" 
                color={theme.palette.secondary[100]}
                sx={{ mb: "1rem", fontWeight: "600" }}
              >
                Campaign Performance Predictions
              </Typography>
              <Box sx={{ height: "calc(100% - 50px)" }}>
                <PredictionBarChart data={campaignInsights} />
              </Box>
            </Card>

            {/* Pie Chart Card - Below Bar Chart */}
            <Card
              sx={{
                gridColumn: "span 6",  // Changed from span 4 to span 6
                backgroundColor: theme.palette.background.alt,
                p: "1.5rem",
                borderRadius: "0.75rem",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                height: "400px",  // Same height as bar chart
                display: "flex",
                flexDirection: "column"
              }}
            >
              <Typography 
                variant="h6" 
                color={theme.palette.secondary[100]}
                sx={{ mb: "1rem", fontWeight: "600" }}
              >
                Prediction Status Distribution
              </Typography>
              <Box sx={{ 
                flex: 1,
                minHeight: 0,
                display: "flex",
                flexDirection: "column"
              }}>
                <PredictionPieChart data={campaignInsights} />
              </Box>
            </Card>

            {/* Empty space for balance */}
            <Box sx={{ gridColumn: "span 6" }} />
          </Box>

          <Box
            display="grid"
            gridTemplateColumns="repeat(12, 1fr)"
            gap="20px"
            sx={{ 
              mb: "80px",
              mt: "40px"  // Added top margin for spacing from pie chart
            }}
          >
            {[
              {
                title: "Average ROI",
                value: campaignInsights.reduce((acc, curr) => acc + curr.prediction.predicted_roi, 0) / campaignInsights.length,
                increase: `${((campaignInsights.reduce((acc, curr) => acc + curr.prediction.predicted_roi, 0) / campaignInsights.length) * 100).toFixed(1)}%`,
                icon: <ROIIcon sx={{ color: theme.palette.secondary[300], fontSize: "26px" }} />,
                description: "Average predicted return on investment"
              },
              {
                title: "Average Clicks",
                value: Math.round(campaignInsights.reduce((acc, curr) => acc + curr.prediction.predicted_engagement.clicks, 0) / campaignInsights.length),
                increase: "Per Campaign",
                icon: <ClicksIcon sx={{ color: theme.palette.secondary[300], fontSize: "26px" }} />,
                description: "Average predicted clicks per campaign"
              },
              {
                title: "Success Rate",
                value: `${(campaignInsights.filter(item => 
                  item.prediction.Prediction_Status === "Highly Successful" || 
                  item.prediction.Prediction_Status === "Moderately Successful"
                ).length / campaignInsights.length * 100).toFixed(1)}%`,
                increase: "Overall",
                icon: <StatusIcon sx={{ color: theme.palette.secondary[300], fontSize: "26px" }} />,
                description: "Percentage of successful campaigns"
              }
            ].map((stat, index) => (
              <Card
                key={index}
                sx={{
                  gridColumn: {
                    xs: "span 12",  // Full width on mobile
                    sm: "span 6",   // Two per row on tablet
                    md: "span 4",   // Three per row on desktop
                  },
                  backgroundColor: theme.palette.background.alt,
                  borderRadius: "0.75rem",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  height: "100%",
                  minHeight: "200px"  // Added minimum height
                }}
              >
                <StatBox {...stat} />
              </Card>
            ))}
          </Box>

          <Card
            sx={{
              mt: "40px",
              mb: "20px",
              backgroundColor: theme.palette.background.alt,
              p: "1.5rem",
              borderRadius: "0.75rem",
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
            }}
          >
            <Typography 
              variant="h6" 
              color={theme.palette.secondary[100]} 
              sx={{ mb: "1.5rem", fontWeight: "600" }}
            >
              Campaign Predictions Details
            </Typography>
            <TableContainer 
              component={Paper} 
              sx={{ 
                maxHeight: 440,
                backgroundColor: "transparent",
                boxShadow: "none"
              }}
            >
              <Table stickyHeader aria-label="campaign predictions table">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ 
                      backgroundColor: theme.palette.background.alt, 
                      fontWeight: 'bold',
                      color: theme.palette.secondary[500]
                    }}>Campaign ID</TableCell>
                    <TableCell sx={{ 
                      backgroundColor: theme.palette.background.alt, 
                      fontWeight: 'bold',
                      color: theme.palette.secondary[500]
                    }}>Predicted ROI</TableCell>
                    <TableCell sx={{ 
                      backgroundColor: theme.palette.background.alt, 
                      fontWeight: 'bold',
                      color: theme.palette.secondary[500]
                    }}>Predicted Clicks</TableCell>
                    <TableCell sx={{ 
                      backgroundColor: theme.palette.background.alt, 
                      fontWeight: 'bold',
                      color: theme.palette.secondary[500]
                    }}>Status</TableCell>
                    <TableCell sx={{ 
                      backgroundColor: theme.palette.background.alt, 
                      fontWeight: 'bold',
                      color: theme.palette.secondary[500]
                    }}>Prediction Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {campaignInsights.map((row) => (
                    <TableRow
                      key={row.campaign.Campaign_ID}
                      sx={{ 
                        '&:nth-of-type(odd)': { 
                          backgroundColor: theme.palette.background.light 
                        },
                        '& .MuiTableCell-root': {
                          color: theme.palette.secondary[500]
                        }
                      }}
                    >
                      <TableCell>{row.campaign.Campaign_ID}</TableCell>
                      <TableCell>{row.prediction.predicted_roi.toFixed(2)}</TableCell>
                      <TableCell>{row.prediction.predicted_engagement.clicks}</TableCell>
                      <TableCell>
                        <Box
                          sx={{
                            backgroundColor: 
                              row.prediction.Prediction_Status === 'Highly Successful' ? '#00C49F' :
                              row.prediction.Prediction_Status === 'Moderately Successful' ? '#FFBB28' :
                              '#0088FE',
                            color: 'white',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            display: 'inline-block'
                          }}
                        >
                          {row.prediction.Prediction_Status}
                        </Box>
                      </TableCell>
                      <TableCell>{new Date(row.prediction.prediction_timestamp).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </>
      )}
    </Box>
  );
};

console.log('Is PredictionsDashboard a valid component?', typeof PredictionsDashboard === 'function');

export default PredictionsDashboard; 