import { MouseEvent, useContext, useState } from "react";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { Button, Menu, MenuItem } from "@mui/material";

import DocContext from "../DocContext";
import HydraLogo from "./HydraLogo";
import OpenApiLogo from "./OpenApiLogo";
import { useStore } from "react-admin";

const DocTypeMenuButton = () => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [, setStoreDocType] = useStore("docType", "hydra");
  const { docType, setDocType } = useContext(DocContext);

  const open = Boolean(anchorEl);
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const changeDocType = (docType: string) => () => {
    setStoreDocType(docType);
    setDocType(docType);
    handleClose();
  };

  return (
    <div>
      <Button
        color="inherit"
        aria-controls={open ? "doc-type-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        {docType === "hydra" ? (
          <>
            <HydraLogo /> Hydra
          </>
        ) : (
          <>
            <OpenApiLogo /> OpenAPI
          </>
        )}
        <ExpandMoreIcon fontSize="small" />
      </Button>
      <Menu
        id="doc-type-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem onClick={changeDocType("hydra")}>Hydra</MenuItem>
        <MenuItem onClick={changeDocType("openapi")}>OpenAPI</MenuItem>
      </Menu>
    </div>
  );
};

export default DocTypeMenuButton;
