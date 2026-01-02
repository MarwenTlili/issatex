"use client";

import {
  Datagrid,
  DateField,
  EditButton,
  FunctionField,
  List,
  ShowButton,
  TextField,
  SimpleList,
  SearchInput,
  FilterButton,
  TopToolbar,
  ExportButton,
  CreateButton,
  Title,
  TextInput,
} from "react-admin";
import type { Theme } from "@mui/material/styles";
import { Box, Chip, Typography } from "@mui/material";
import { useMediaQuery } from "@mui/material";

import AvatarField from "./AvatarField";
import RowActions from "@/components/admin/common/row-actions";

const listFilters = [
  <SearchInput key="search" source="ref" alwaysOn />,
  <TextInput id="text-input-email" key={"email"} source="email" />,
  <TextInput id="text-input-username" key={"username"} source="username" />,
];

const ListActions = () => {
  return (
    <TopToolbar>
      <FilterButton />
      <CreateButton />
      <ExportButton />
    </TopToolbar>
  );
};

const UserStatusField = ({ record }: { record?: any }) => (
  <Chip
    label={record?.enabled ? "Active" : "Inactive"}
    color={record?.enabled ? "success" : "error"}
    size="small"
    sx={{ fontWeight: 500 }}
  />
);

export const UserList = () => {
  const isSmall = useMediaQuery((theme: Theme) => theme.breakpoints.down("md"));

  return (
    <List
      title={<Title title="Users" />}
      actions={<ListActions />}
      filters={listFilters}
      sx={{
        "& .RaList-main": {
          borderRadius: 2,
          overflow: "hidden",
        },
      }}
    >
      {isSmall ? (
        <>
          <SimpleList
            primaryText={(record) => record.username}
            secondaryText={(record) => record.email}
            tertiaryText={(record) => (
              <Box>
                <Typography variant="body2" color="text.secondary">
                  {new Date(record.createdAt).toLocaleDateString()}
                </Typography>
                <Box mt={0.5} color={"text.primary"}>
                  <UserStatusField record={record} />
                </Box>
              </Box>
            )}
            leftAvatar={(record) => <AvatarField record={record} size={40} />}
            // rightIcon={(record) => <UserStatusField record={record} />}
            rowClick={"show"}
            sx={{
              "& .MuiListItemButton-root": {
                transition: "background-color 0.2s ease",
                "&:hover": {
                  backgroundColor: "rgba(0, 0, 0, 0.04)",
                },
              },
              "& .MuiListItemText-primary": {
                fontWeight: 500,
              },
            }}
          />
        </>
      ) : (
        <Datagrid
          rowClick={false}
          bulkActionButtons={false}
          sx={{
            "& .RaDatagrid-headerCell": {
              backgroundColor: "#f5f8ff",
              fontWeight: 600,
              color: "#334155",
            },
            "& .RaDatagrid-row": {
              transition: "background-color 0.2s ease",
              "&:hover": {
                backgroundColor: "rgba(59, 130, 246, 0.04) !important",
              },
            },
            "& .column-roles": {
              maxWidth: 200,
            },
          }}
        >
          <TextField
            source="ref"
            label="Ref"
            sx={{ fontFamily: "monospace", color: "#64748b" }}
          />
          <FunctionField
            label="User"
            render={(record) => (
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <AvatarField record={record} size={40} />
                <Box>
                  <Typography variant="body1" fontWeight={500}>
                    {record.username}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {record.email}
                  </Typography>
                </Box>
              </Box>
            )}
          />
          <FunctionField
            label="Roles"
            source="roles"
            render={(record) => (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {Array.isArray(record.roles) ? (
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
                    label={record.roles}
                    size="small"
                    color="primary"
                    variant="outlined"
                    sx={{ fontWeight: 500 }}
                  />
                )}
              </Box>
            )}
          />
          <DateField source="createdAt" label="Created" />
          <DateField source="lastLoginAt" label="Last Login" />
          <FunctionField
            label="Status"
            render={(record) => <UserStatusField record={record} />}
          />
          <RowActions resource="api/users" />
        </Datagrid>
      )}
    </List>
  );
};
