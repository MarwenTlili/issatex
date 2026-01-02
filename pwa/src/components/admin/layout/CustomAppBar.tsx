import React from "react";
import { AppBar, AppBarProps, TitlePortal, useAuthProvider } from "react-admin";
import { Box, Theme, Typography, useMediaQuery, useTheme } from "@mui/material";
import FactoryIcon from "@mui/icons-material/Factory";

const CustomAppBar = ({ classes, userMenu, ...props }: AppBarProps) => {
  const authProvider = useAuthProvider();
  const theme = useTheme();
  const isSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.up("sm"));

  const isDark = theme.palette.mode === "dark";
  const logoColor = isDark ? "#ffffff" : "AliceBlue";

  return (
    <AppBar userMenu={userMenu ?? !!authProvider} {...props}>
      {isSmall && <TitlePortal />}
      {!isSmall && <Box component="span" sx={{ flex: 1 }} />}

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          flexGrow: 1,
        }}
      >
        <FactoryIcon fontSize="large" style={{ color: logoColor }} />
        <Typography
          variant="h6"
          style={{
            fontFamily: "Roboto, sans-serif",
            fontWeight: 700,
            fontSize: 20,
          }}
        >
          Issatex
        </Typography>
      </Box>
    </AppBar>
  );
};

export default CustomAppBar;
