"use client";

import type React from "react";

import { useState } from "react";
import {
  Edit,
  SimpleForm,
  TextInput,
  BooleanInput,
  useRecordContext,
  useNotify,
  useRedirect,
  TopToolbar,
  ListButton,
  ShowButton,
  SaveButton,
  DeleteButton,
  useInput,
  AutocompleteArrayInput,
  required,
  email,
} from "react-admin";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Avatar,
  Button,
  Divider,
  CircularProgress,
  Alert,
  Stack,
} from "@mui/material";
import {
  Person,
  PhotoCamera,
  History,
  Visibility,
  Delete,
} from "@mui/icons-material";
import { getSession } from "next-auth/react";
import { ENTRYPOINT } from "@/config/entrypoint";
import { useFormContext } from "react-hook-form";
import { User } from "@/types/resources";

// Constants
const ROLE_CHOICES = [
  { id: "ROLE_ADMIN", name: "Admin" },
  { id: "ROLE_SECRETARY", name: "Secrétaire" },
  { id: "ROLE_WAREHOUSEMAN", name: "Magasinier" },
  { id: "ROLE_USER", name: "User (par défaut)" },
];

// Types
type AvatarAction = "keep" | "change" | "delete";
type AvatarState = {
  action: AvatarAction;
  file: File | null;
};

/**
 * User Edit Actions component for the top toolbar
 */
const UserEditActions = () => (
  <TopToolbar>
    <ListButton label="Back to List" icon={<History />} />
    <ShowButton label="View" icon={<Visibility />} />
  </TopToolbar>
);

/**
 * User Edit Toolbar component with save and delete buttons
 */
const UserEditToolbar = (props: any) => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      p: 2,
    }}
  >
    <SaveButton {...props} label="Save Changes" />
    <DeleteButton />
  </Box>
);

/**
 * User Title component to display the username being edited
 */
const UserTitle = () => {
  const record = useRecordContext<User>();
  return record ? (
    <Typography variant="h5">Edit {record.username}</Typography>
  ) : null;
};

/**
 * Upload avatar to the server
 */
const uploadAvatar = async (file: File): Promise<any> => {
  const session = await getSession();

  if (!session?.accessToken) {
    throw new Error("Not authenticated");
  }

  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${ENTRYPOINT}/api/avatars`, {
    method: "POST",
    body: formData,
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to upload avatar");
  }

  return response.json();
};

/**
 * Update user data on the server
 */
const updateUser = async (userId: string, userData: any): Promise<any> => {
  const session = await getSession();

  if (!session?.accessToken) {
    throw new Error("Not authenticated");
  }

  // Extract the numeric ID from the IRI string if needed
  const numericId = userId.includes("/") ? userId.split("/").pop() : userId;

  const response = await fetch(`${ENTRYPOINT}/api/users/${numericId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/merge-patch+json",
      Authorization: `Bearer ${session.accessToken}`,
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to update user");
  }

  return response.json();
};

/**
 * Avatar Input component that handles avatar display, upload and deletion
 */
const AvatarInput = ({
  source,
  onAvatarChange,
}: {
  source: string;
  onAvatarChange: (state: AvatarState) => void;
}) => {
  const record = useRecordContext<User>();
  const [preview, setPreview] = useState<string | undefined>();
  const [avatarAction, setAvatarAction] = useState<AvatarAction>("keep");
  const { resetField } = useFormContext();

  // Use useInput to integrate with react-admin's form state
  const { field } = useInput({ source });

  // Get the current avatar URL if it exists
  const avatarUrl = record?.avatar?.contentUrl;

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;

    if (file) {
      // Create a preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Update the form field value to mark the form as dirty
      // field.onChange({ target: { value: `avatar_changed_${Date.now()}` } });
      field.onChange("change");

      // Set avatar action to change
      setAvatarAction("change");

      // Notify parent component about the avatar change
      onAvatarChange({ action: "change", file });

      // Clear input value to allow re-selecting the same file later
      e.target.value = "";
    }
  };

  const handleDeleteAvatar = () => {
    // Clear preview
    setPreview(undefined);

    // Update the form field value to mark the form as dirty
    field.onChange("delete");

    // Set avatar action to delete
    setAvatarAction("delete");

    // Notify parent component about the avatar deletion
    onAvatarChange({ action: "delete", file: null });
  };

  const handleCancelChanges = () => {
    // Clear preview
    setPreview(undefined);

    // Reset avatar action
    setAvatarAction("keep");

    // Reset the form field
    resetField(source, { defaultValue: "keep" });

    // Notify parent component
    onAvatarChange({ action: "keep", file: null });
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        mb: 3,
      }}
    >
      <Avatar
        src={preview || (avatarAction !== "delete" ? avatarUrl : undefined)}
        sx={{
          width: 120,
          height: 120,
          mb: 2,
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          border: "4px solid white",
        }}
      >
        {!preview && (avatarAction === "delete" || !avatarUrl) && (
          <Person sx={{ fontSize: 60 }} />
        )}
      </Avatar>

      <input
        accept="image/*"
        style={{ display: "none" }}
        id="avatar-upload"
        type="file"
        onChange={handleAvatarChange}
        tabIndex={-1}
        aria-hidden="true"
      />

      <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
        {/* Change avatar button */}
        <label htmlFor="avatar-upload">
          <Button
            variant="outlined"
            component="span"
            startIcon={<PhotoCamera />}
            size="small"
          >
            Change
          </Button>
        </label>

        {/* Delete avatar button - only show if there's an avatar to delete */}
        {(avatarUrl || avatarAction === "change") &&
          avatarAction !== "delete" && (
            <Button
              variant="outlined"
              color="error"
              startIcon={<Delete />}
              size="small"
              onClick={handleDeleteAvatar}
            >
              Delete
            </Button>
          )}

        {/* Cancel button - only show if changes were made */}
        {avatarAction !== "keep" && (
          <Button variant="text" size="small" onClick={handleCancelChanges}>
            Cancel
          </Button>
        )}
      </Stack>

      {/* This hidden input is connected to the form and will be updated when an avatar is selected */}
      <input id="avatar-upload-hidden" type="hidden" {...field} />
    </Box>
  );
};

/**
 * Validate user form data
 */
const validateUserForm = (values: any) => {
  const errors: Record<string, string> = {};

  if (!values.username) {
    errors.username = "Username is required";
  }

  if (!values.email) {
    errors.email = "Email is required";
  } else if (!/\S+@\S+\.\S+/.test(values.email)) {
    errors.email = "Invalid email";
  }

  if (!values.roles || values.roles.length === 0) {
    errors.roles = "At least one role is required";
  }

  return errors;
};

/**
 * Main UserEdit component
 */
export const UserEdit = () => {
  const notify = useNotify();
  const redirect = useRedirect();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [avatarState, setAvatarState] = useState<AvatarState>({
    action: "keep",
    file: null,
  });

  // Handle avatar state changes
  const handleAvatarChange = (state: AvatarState) => {
    setAvatarState(state);
  };

  // Handle form submission with avatar upload/deletion and user update
  const handleSubmit = async (values: Partial<User>) => {
    setIsSubmitting(true);
    setError(null);

    try {
      let avatarId = null;

      // Step 1: Handle avatar based on the action
      if (avatarState.action === "change" && avatarState.file) {
        // try {
        const avatarData = await uploadAvatar(avatarState.file);
        avatarId = avatarData["@id"];
        notify("Avatar uploaded successfully", { type: "info" });
      }

      // Step 2: Prepare user data for update
      const userData: Record<string, any> = {
        username: values.username,
        email: values.email,
        roles: values.roles,
        enabled: values.enabled,
      };

      // Add avatar data based on the action
      if (avatarState.action === "change" && avatarId) {
        userData.avatar = avatarId;
      } else if (avatarState.action === "delete") {
        userData.avatar = null; // Set to null to remove the avatar
      }

      // Step 3: Update user
      if (!values["@id"]) {
        throw new Error("User ID is missing");
      }
      await updateUser(values["@id"], userData);

      // Step 4: Show success notification and redirect
      notify("User updated successfully", { type: "success" });
      redirect("list", "api/users");

      setAvatarState({ action: "keep", file: null });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "An unknown error occurred";
      setError(message);
      notify(`Error: ${message}`, { type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Edit
      actions={<UserEditActions />}
      title={<UserTitle />}
      mutationMode="pessimistic"
    >
      <SimpleForm
        onSubmit={handleSubmit}
        validate={validateUserForm}
        toolbar={<UserEditToolbar />}
      >
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {isSubmitting && (
          <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
            <CircularProgress size={24} sx={{ mr: 1 }} />
            <Typography>Updating user...</Typography>
          </Box>
        )}

        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 2,
                boxShadow: "0 4px 20px 0 rgba(0,0,0,0.05)",
              }}
            >
              {/* Pass the avatar change handler to the AvatarInput component */}
              <AvatarInput
                source="avatar_changed"
                onAvatarChange={handleAvatarChange}
              />

              {avatarState.action !== "keep" && (
                <Alert severity="info" sx={{ mt: 2, mb: 1 }}>
                  {avatarState.action === "change"
                    ? "New avatar will be uploaded when you save"
                    : "Avatar will be removed when you save"}
                </Alert>
              )}

              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle1" gutterBottom>
                Account Status
              </Typography>
              <BooleanInput
                id="boolean-input-enabled"
                source="enabled"
                label="Active Account"
                sx={{
                  "& .MuiSwitch-switchBase.Mui-checked": {
                    color: "success.main",
                  },
                  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                    backgroundColor: "success.main",
                  },
                }}
              />
            </Paper>
          </Grid>

          <Grid item xs={12} md={8}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 2,
                boxShadow: "0 4px 20px 0 rgba(0,0,0,0.05)",
              }}
            >
              <Typography variant="h6" gutterBottom>
                User Information
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextInput
                    id="text-input-ref"
                    source="ref"
                    label="User Ref"
                    fullWidth
                    helperText="User ID cannot be changed"
                    InputProps={{ readOnly: true }}
                    sx={{
                      "& .MuiInputBase-input.Mui-disabled": {
                        WebkitTextFillColor: "#666",
                        fontFamily: "monospace",
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextInput
                    id="text-input-username"
                    source="username"
                    type="text"
                    label="Username"
                    helperText="Required field"
                    autoComplete="off"
                    fullWidth
                    validate={[required()]}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextInput
                    id="text-input-email"
                    source="email"
                    type="email"
                    label="Email Address"
                    helperText="Required field"
                    autoComplete="off"
                    fullWidth
                    validate={[required(), email()]}
                  />
                </Grid>

                <Grid item xs={12}>
                  <AutocompleteArrayInput
                    source="roles"
                    label="User Roles"
                    choices={ROLE_CHOICES}
                    fullWidth
                    validate={[required("At least one role is required")]}
                    sx={{
                      "& .MuiAutocomplete-input": {
                        border: 0,
                      },
                      "& .MuiChip-root": {
                        borderRadius: 1,
                        fontWeight: 500,
                      },
                    }}
                  />
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </SimpleForm>
    </Edit>
  );
};
