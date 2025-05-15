import {
  Show,
  TextField,
  DateField,
  EmailField,
  useRecordContext,
  TopToolbar,
  EditButton,
  ListButton,
  FunctionField,
  TabbedShowLayout,
} from "react-admin";
import {
  Box,
  Chip,
  Typography,
  Avatar,
  Grid,
  Paper,
  Divider,
} from "@mui/material";
import {
  Person,
  Email,
  CalendarToday,
  AccessTime,
  VpnKey,
  Badge,
  VerifiedUser,
  History,
} from "@mui/icons-material";

const UserShowActions = () => (
  <TopToolbar>
    <ListButton label="Back" icon={<History />} />
    <EditButton />
  </TopToolbar>
);

const UserTitle = () => {
  const record = useRecordContext();
  return record ? (
    <Typography variant="h5">{record.username}</Typography>
  ) : null;
};

const UserStatusField = ({ record }: { record?: any }) => (
  <Chip
    label={record?.enabled ? "Active" : "Inactive"}
    color={record?.enabled ? "success" : "error"}
    size="small"
    sx={{ fontWeight: 500 }}
  />
);

const RolesField = ({ record }: { record?: any }) => (
  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
    {Array.isArray(record?.roles) ? (
      record.roles.map((role: string, index: number) => (
        <Chip
          key={index}
          label={role.replace("ROLE_", "")}
          size="small"
          color="primary"
          variant="outlined"
          sx={{ fontWeight: 500 }}
        />
      ))
    ) : (
      <Chip
        label={record?.roles?.replace("ROLE_", "")}
        size="small"
        color="primary"
        variant="outlined"
        sx={{ fontWeight: 500 }}
      />
    )}
  </Box>
);

const UserAvatar = () => {
  const record = useRecordContext();
  const avatarUrl = record?.avatar?.contentUrl || null;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        mb: 2,
      }}
    >
      <Avatar
        src={avatarUrl}
        sx={{
          width: 120,
          height: 120,
          mb: 2,
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          border: "4px solid white",
        }}
      >
        {!avatarUrl && <Person sx={{ fontSize: 60 }} />}
      </Avatar>
      <Typography variant="h5" fontWeight="bold">
        {record?.username}
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        {record?.email}
      </Typography>
      <UserStatusField record={record} />
    </Box>
  );
};

export const UserShow = () => (
  <Show actions={<UserShowActions />} title={<UserTitle />}>
    <Grid container spacing={3}>
      <Grid item xs={12} md={4}>
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 2,
            boxShadow: "0 4px 20px 0 rgba(0,0,0,0.05)",
            height: "100%",
          }}
        >
          <UserAvatar />
          <Divider sx={{ my: 2 }} />
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              User ID
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Badge sx={{ color: "primary.main", mr: 1 }} />
              <TextField source="ref" component="span" />
            </Box>

            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Email
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Email sx={{ color: "primary.main", mr: 1 }} />
              <EmailField source="email" component="span" />
            </Box>

            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Roles
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <VpnKey sx={{ color: "primary.main", mr: 1 }} />
              <FunctionField
                render={(record) => <RolesField record={record} />}
              />
            </Box>
          </Box>
        </Paper>
      </Grid>

      <Grid item xs={12} md={8}>
        <TabbedShowLayout>
          <TabbedShowLayout.Tab label="Details" icon={<Person />}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 2,
                boxShadow: "0 4px 20px 0 rgba(0,0,0,0.05)",
              }}
            >
              <Typography variant="h6" gutterBottom>
                Account Information
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Created At
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <CalendarToday
                      sx={{ color: "primary.main", mr: 1, fontSize: "small" }}
                    />
                    <DateField
                      source="createdAt"
                      showTime
                      options={{
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      }}
                      component="span"
                    />
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Last Login
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <AccessTime
                      sx={{ color: "primary.main", mr: 1, fontSize: "small" }}
                    />
                    <DateField
                      source="lastLoginAt"
                      showTime
                      options={{
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      }}
                      component="span"
                    />
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Status
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <VerifiedUser
                      sx={{ color: "primary.main", mr: 1, fontSize: "small" }}
                    />
                    <FunctionField
                      render={(record) => <UserStatusField record={record} />}
                    />
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </TabbedShowLayout.Tab>

          <TabbedShowLayout.Tab label="Activity" icon={<History />}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 2,
                boxShadow: "0 4px 20px 0 rgba(0,0,0,0.05)",
              }}
            >
              <Typography variant="body1">
                User activity will be displayed here.
              </Typography>
            </Paper>
          </TabbedShowLayout.Tab>
        </TabbedShowLayout>
      </Grid>
    </Grid>
  </Show>
);
