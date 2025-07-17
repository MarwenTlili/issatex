"use client";

import { useState } from "react";
import {
  Create,
  SimpleForm,
  TextInput,
  BooleanInput,
  SelectArrayInput,
  required,
  email,
  useNotify,
  useRedirect,
  TopToolbar,
  ListButton,
  SaveButton,
  PasswordInput,
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
} from "@mui/material";
import { Person, PhotoCamera, History } from "@mui/icons-material";
import { getSession } from "next-auth/react";
import { ENTRYPOINT } from "@/config/entrypoint";

const roleChoices = [
  { id: "ROLE_ADMIN", name: "Admin" },
  { id: "ROLE_CLIENT", name: "Client" },
  { id: "ROLE_SECRETARY", name: "Secrétaire" },
  { id: "ROLE_WAREHOUSEMAN", name: "Magasinier" },
  { id: "ROLE_USER", name: "User (par défaut)" },
];

const initialValues = {
  enabled: false,
};

const UserCreateActions = () => (
  <TopToolbar>
    <ListButton label="Back to List" icon={<History />} />
  </TopToolbar>
);

const UserCreateToolbar = (props: any) => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "flex-end",
      p: 2,
    }}
  >
    <SaveButton {...props} label="Create User" />
  </Box>
);

// Function to upload avatar using the same authentication mechanism as your data provider
const uploadAvatar = async (file: string | Blob) => {
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

// Function to create a user with the given data
const createUser = async (userData: any) => {
  const session = await getSession();

  if (!session?.accessToken) {
    throw new Error("Not authenticated");
  }

  const response = await fetch(`${ENTRYPOINT}/api/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.accessToken}`,
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to create user");
  }

  return response.json();
};

const AvatarInput = ({ onChange }: { onChange: any }) => {
  const [preview, setPreview] = useState<string | undefined>();
  const [selectedFile, setSelectedFile] = useState(null);

  const handleAvatarChange = async (e: any) => {
    const file = e.target.files[0];
    if (!file) return;

    // Store the file for later upload
    setSelectedFile(file);

    // Create a preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Notify parent component about the selected file
    onChange(file);
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
        src={preview}
        sx={{
          width: 120,
          height: 120,
          mb: 2,
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          border: "4px solid white",
        }}
      >
        {!preview && <Person sx={{ fontSize: 60 }} />}
      </Avatar>

      <input
        accept="image/*"
        style={{ display: "none" }}
        id="avatar-upload"
        type="file"
        onChange={handleAvatarChange}
      />
      <label htmlFor="avatar-upload">
        <Button
          variant="outlined"
          component="span"
          startIcon={<PhotoCamera />}
          sx={{ mt: 1 }}
        >
          {selectedFile ? "Change Avatar" : "Upload Avatar"}
        </Button>
      </label>
    </Box>
  );
};

export const UserCreate = () => {
  const notify = useNotify();
  const redirect = useRedirect();
  const [selectedAvatarFile, setSelectedAvatarFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle avatar file selection
  const handleAvatarChange = (file: any) => {
    setSelectedAvatarFile(file);
  };

  // Handle form submission with avatar upload and user creation in a single transaction
  const handleSubmit = async (values: any) => {
    setIsSubmitting(true);
    setError(null);

    try {
      let avatarId = null;

      // Step 1: Upload avatar if selected
      if (selectedAvatarFile) {
        const avatarData = await uploadAvatar(selectedAvatarFile);
        avatarId = avatarData["@id"];
      }

      // Step 2: Create user with avatar ID
      const userData = avatarId ? { ...values, avatar: avatarId } : values;
      await createUser(userData);

      // Step 3: Show success notification and redirect
      notify("User created successfully", { type: "success" });
      redirect("list", "api/users");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred.";
      setError(errorMessage);
      notify(`Error: ${errorMessage}`, { type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Create
      actions={<UserCreateActions />}
      title="Create New User"
      redirect={false}
    >
      <SimpleForm
        toolbar={<UserCreateToolbar />}
        defaultValues={initialValues}
        onSubmit={handleSubmit}
      >
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {isSubmitting && (
          <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
            <CircularProgress size={24} sx={{ mr: 1 }} />
            <Typography>Creating user...</Typography>
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
              <AvatarInput onChange={handleAvatarChange} />
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle1" gutterBottom>
                Account Status
              </Typography>
              <BooleanInput
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
                disabled={isSubmitting}
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
                    source="username"
                    label="Username"
                    fullWidth
                    validate={required()}
                    helperText="Required field"
                    disabled={isSubmitting}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextInput
                    source="email"
                    label="Email Address"
                    fullWidth
                    validate={[required(), email()]}
                    helperText="Required field"
                    type="email"
                    disabled={isSubmitting}
                  />
                </Grid>

                <Grid item xs={12}>
                  <PasswordInput
                    source="plainPassword"
                    label="Password"
                    fullWidth
                    validate={required()}
                    helperText="Required field"
                    disabled={isSubmitting}
                  />
                </Grid>

                <Grid item xs={12}>
                  <SelectArrayInput
                    source="roles"
                    label="User Roles"
                    choices={roleChoices}
                    fullWidth
                    validate={required()}
                    sx={{
                      "& .MuiChip-root": {
                        borderRadius: 1,
                        fontWeight: 500,
                      },
                    }}
                    disabled={isSubmitting}
                  />
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </SimpleForm>
    </Create>
  );
};
