"use client";

import React, { useRef, useState } from "react";
import {
  useRecordContext,
  useRedirect,
  useNotify,
  useDelete,
  useRefresh,
} from "react-admin";
import {
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import {
  MoreVert as MoreVertIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";

/**
 * Generic props definition
 */
export interface RowActionsProps<TRecord extends { id: string | number }> {
  resource: string;
  record?: TRecord;
  labels?: {
    show?: string;
    edit?: string;
    delete?: string;
    confirmTitle?: string;
    confirmMessage?: string;
    cancel?: string;
    confirmDelete?: string;
  };
  hideActions?: {
    show?: boolean;
    edit?: boolean;
    delete?: boolean;
  };
}

/**
 * Generic RowActions component for react-admin List.
 * Provides show, edit, and delete actions with confirmation dialog.
 */
export default function RowActions<TRecord extends { id: string | number }>({
  resource,
  record: propRecord,
  labels,
  hideActions,
}: RowActionsProps<TRecord>) {
  const contextRecord = useRecordContext<TRecord>();
  const record = propRecord ?? contextRecord;
  const redirect = useRedirect();
  const notify = useNotify();
  const [deleteRecord] = useDelete();
  const refresh = useRefresh();

  // 2. Create a ref for the menu trigger button
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  if (!record) return null;

  // Menu handlers
  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Actions
  const handleShow = () => {
    handleMenuClose();
    redirect("show", resource, record.id);
  };

  const handleEdit = () => {
    handleMenuClose();
    redirect("edit", resource, record.id);
  };

  const handleDeleteClick = () => {
    handleMenuClose();
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    deleteRecord(
      resource,
      { id: record.id },
      {
        mutationMode: "pessimistic",
        onSuccess: () => {
          setIsDeleteDialogOpen(false);
          refresh();
          notify(labels?.delete ?? "Enregistrement supprimé avec succès", {
            type: "success",
          });
        },
        onError: (error: any) => {
          const backendMessage =
            error?.body?.detail ||
            error?.message ||
            "Échec de la suppression de l'enregistrement";
          notify(backendMessage, { type: "error" });
          setIsDeleteDialogOpen(false);
        },
      }
    );
  };

  const handleDeleteCancel = () => {
    setIsDeleteDialogOpen(false);
  };

  return (
    <>
      {/* Trigger Button */}
      <IconButton ref={menuButtonRef} size="small" onClick={handleMenuOpen}>
        <MoreVertIcon fontSize="small" />
      </IconButton>

      {/* Menu */}
      <Menu
        id="row-actions-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        {!hideActions?.show && (
          <MenuItem onClick={handleShow}>
            <VisibilityIcon fontSize="small" sx={{ mr: 1 }} />
            {labels?.show ?? "Détails"}
          </MenuItem>
        )}
        {!hideActions?.edit && (
          <MenuItem onClick={handleEdit}>
            <EditIcon fontSize="small" sx={{ mr: 1 }} />
            {labels?.edit ?? "Modifier"}
          </MenuItem>
        )}
        {!hideActions?.delete && (
          <MenuItem onClick={handleDeleteClick} sx={{ color: "error.main" }}>
            <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
            {labels?.delete ?? "Supprimer"}
          </MenuItem>
        )}
      </Menu>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onClose={handleDeleteCancel}>
        <DialogTitle id="delete-dialog-title">
          {labels?.confirmTitle ?? "Confirmer la suppression"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            {labels?.confirmMessage ??
              "Êtes-vous sûr de vouloir supprimer cet enregistrement ? Cette action est irréversible."}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="inherit">
            {labels?.cancel ?? "Annuler"}
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" autoFocus>
            {labels?.confirmDelete ?? "Supprimer"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
