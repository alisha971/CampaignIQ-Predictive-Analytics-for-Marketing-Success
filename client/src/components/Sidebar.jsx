/* eslint-disable react/prop-types */
import {
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  useTheme,
} from "@mui/material";
import {
  ChevronLeft,
  ChevronRightOutlined,
  HomeOutlined,
  TrendingUpOutlined,
} from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import FlexBetween from "./FlexBetween";

const navItems = [
  {
    text: "Dashboard",
    icon: <HomeOutlined />,
    path: "/dashboard"
  },
  {
    text: "Predictions",
    icon: <TrendingUpOutlined />,
    path: "/predictions"
  }
];

const Sidebar = ({
  drawerWidth,
  isSidebarOpen,
  setIsSidebarOpen,
  isNonMobile,
}) => {
  const { pathname } = useLocation();
  const [active, setActive] = useState("");
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    setActive(pathname.substring(1));
  }, [pathname]);

  return (
    <Box component="nav">
      {isSidebarOpen && (
        <Drawer
          open={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          variant="persistent"
          anchor="left"
          sx={{
            width: drawerWidth,
            "& .MuiDrawer-paper": {
              color: theme.palette.secondary[200],
              backgroundColor: theme.palette.background.alt,
              boxSizing: "border-box",
              borderWidth: isNonMobile ? 0 : "2px",
              width: drawerWidth,
            },
          }}
        >
          <Box width="100%">
            <Box m="1.5rem 2rem 2rem 3rem">
              <FlexBetween color={theme.palette.secondary.main}>
                <Box display="flex" alignItems="center" gap="0.5rem">
                  <Typography variant="h4" fontWeight="bold">
                    XENIA
                  </Typography>
                </Box>
                {!isNonMobile && (
                  <IconButton onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                    <ChevronLeft />
                  </IconButton>
                )}
              </FlexBetween>
            </Box>
            <List>
              {navItems.map(({ text, icon, path }) => {
                const lcText = text.toLowerCase();

                return (
                  <ListItem
                    key={text}
                    disablePadding
                    sx={{
                      backgroundColor: active === lcText ? 'rgba(228, 233, 252, 0.8)' : 'transparent',
                      margin: "0.3rem 0.8rem",
                      borderRadius: "10px",
                      '&:hover': {
                        backgroundColor: active === lcText 
                          ? 'rgba(228, 233, 252, 0.8)'
                          : 'rgba(228, 233, 252, 0.4)'
                      }
                    }}
                  >
                    <ListItemButton
                      onClick={() => {
                        navigate(`/${lcText}`);
                        setActive(lcText);
                      }}
                      sx={{
                        py: "0.8rem",
                        px: "1.5rem",
                        borderRadius: "10px",
                        '&.Mui-selected': {
                          backgroundColor: 'transparent'
                        }
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          ml: "0.2rem",
                          color: active === lcText 
                            ? '#1A73E8'
                            : theme.palette.secondary[100],
                        }}
                      >
                        {icon}
                      </ListItemIcon>
                      <ListItemText 
                        primary={text}
                        sx={{
                          '& .MuiTypography-root': {
                            color: active === lcText 
                              ? '#1A73E8'
                              : theme.palette.secondary[200],
                            fontWeight: active === lcText ? 600 : 400
                          }
                        }}
                      />
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
          </Box>
        </Drawer>
      )}
    </Box>
  );
};

export default Sidebar;
