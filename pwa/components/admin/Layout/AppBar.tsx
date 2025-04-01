import {
  AppBar,
  AppBarClasses,
  LocalesMenuButton,
  useAuthProvider,
} from "react-admin";
import type { AppBarProps } from "react-admin";
import { Box, Typography } from "@mui/material";

import Logo from "./Logo";
import DocTypeMenuButton from "./DocTypeMenuButton";

const CustomAppBar = ({ classes, userMenu, ...props }: AppBarProps) => {
  const authProvider = useAuthProvider();

  const goToHomepage = () => {
    window.location.href = "/";
  };

  return (
    <AppBar userMenu={userMenu ?? !!authProvider} {...props}>
      <Typography
        variant="h6"
        color="inherit"
        className={`${AppBarClasses.title} w-[200px]`}
        id="react-admin-title"
      />
      <div className="flex-1">
        <button
          style={{ background: "none", border: "none", cursor: "pointer" }}
          onClick={goToHomepage}
        >
          <Logo />
        </button>
      </div>
      <Box component="span" sx={{ flex: 0 }} />
      <DocTypeMenuButton />
      <Box component="span" sx={{ flex: 0.5 }} />
      <LocalesMenuButton
        languages={[
          { locale: "en", name: "English" },
          { locale: "fr", name: "Français" },
        ]}
      />
    </AppBar>
  );
};

export default CustomAppBar;
