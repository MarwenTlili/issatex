import React from "react";
import { AppBar, TitlePortal } from "react-admin";
import { Box, Typography, useTheme } from "@mui/material";
import FactoryIcon from "@mui/icons-material/Factory";

const CustomAppBar = () => {
  const theme = useTheme();

  const isDark = theme.palette.mode === "dark";

  const logoColor = isDark ? "#ffffff" : "AliceBlue";

  return (
    <AppBar>
      <Box
        sx={{
          position: "relative",
          width: "100%",
          display: "flex",
          alignItems: "center",
        }}
      >
        {/* LEFT: menu button + TitlePortal */}
        <Box sx={{ display: { xs: "none", sm: "flex" }, alignItems: "center" }}>
          <TitlePortal />
        </Box>

        {/* CENTER: logo + "Admin" */}
        <Box
          sx={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            alignItems: "center",
            gap: 1,
            pointerEvents: "none", // clicks go through to RA actions
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
      </Box>
    </AppBar>
  );
};

export default CustomAppBar;
