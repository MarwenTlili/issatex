import { createTheme, Theme } from "@mui/material";
import { defaultTheme } from "react-admin";

export const lightTheme = createTheme({
  ...defaultTheme,
  components: {
    MuiMenuItem: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderLeft: "3px solid transparent",
          transition: "border-color 0.2s, background-color 0.2s",

          "&.RaMenuItemLink-active": {
            borderLeftColor: theme.palette.primary.main,
            backgroundColor: theme.palette.action.selected,
            fontWeight: theme.typography.fontWeightMedium,
          },

          "&:hover": {
            backgroundColor: theme.palette.action.hover,
          },
        }),
      },
    },
  },
});

export const darkTheme = createTheme({
  ...defaultTheme,
  palette: { mode: "dark" },
  components: {
    MuiMenuItem: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderLeft: "3px solid transparent",
          transition: "border-color 0.2s, background-color 0.2s",

          "&.RaMenuItemLink-active": {
            borderLeftColor: theme.palette.primary.main,
            backgroundColor: theme.palette.action.selected,
            fontWeight: theme.typography.fontWeightMedium,
          },

          "&:hover": {
            backgroundColor: theme.palette.action.hover,
          },
        }),
      },
    },
  },
});
