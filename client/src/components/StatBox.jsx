/* eslint-disable react/prop-types */
import { Box, Typography, useTheme, Divider } from "@mui/material";
import FlexBetween from "./FlexBetween";

function StatBox({ title, value, increase, icon, description }) {
  const theme = useTheme();
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      p="1.5rem"
      flex="1 1 100%"
      sx={{ height: "100%" }}
    >
      <FlexBetween>
        <Typography 
          variant="h6" 
          sx={{ 
            color: theme.palette.secondary[500],
            fontWeight: "600"
          }}
        >
          {title}
        </Typography>
        {icon}
      </FlexBetween>

      <Typography
        variant="h3"
        fontWeight="600"
        sx={{ 
          color: theme.palette.secondary[500],
          my: "1rem"
        }}
      >
        {value}
      </Typography>
      
      <Divider sx={{ my: "1rem" }} />
      
      <FlexBetween gap="1rem">
        <Typography
          variant="h5"
          fontStyle="italic"
          sx={{ 
            color: theme.palette.secondary[400],
            fontWeight: "500"
          }}
        >
          {increase}
        </Typography>
        <Typography 
          variant="body2"
          sx={{ 
            color: theme.palette.secondary[500],
            fontWeight: "400"
          }}
        >
          {description}
        </Typography>
      </FlexBetween>
    </Box>
  );
}

export default StatBox;
