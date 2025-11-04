import {
  List,
  Datagrid,
  TextField,
  BooleanField,
  ReferenceField,
  BooleanInput,
  SearchInput,
  useListContext,
  useGetOne,
  Identifier,
  Link,
} from "react-admin";
import {
  type Theme,
  useMediaQuery,
  Box,
  Stack,
  Chip,
  CircularProgress,
  Card,
  CardHeader,
  CardContent,
} from "@mui/material";
import RowActions from "@/components/admin/common/row-actions";
import { Client } from "@/types/resources/Client";
import { User } from "@/types/resources/User";
import { orange } from "@mui/material/colors";

export const AccountUsernameField = ({ record }: { record: Client }) => {
  const { data, isLoading, error } = useGetOne<User>("api/users", {
    id: record?.account as unknown as number | undefined,
  });

  if (!record?.account || !data) {
    return <Box>—</Box>;
  }

  if (isLoading) {
    return <CircularProgress size={16} />;
  }

  if (error) {
    return <Box className="text-destructive text-xs">Error loading</Box>;
  }

  return (
    <Link to={`/api/users/${encodeURIComponent(data["@id"])}/show`}>
      {data.username}
    </Link>
  );
};

const filters = [
  <SearchInput key="search" source="ref" alwaysOn />,
  <BooleanInput key="privilegie" source="privilegie" label="Privilégié" />,
];

const MobileClientList = () => {
  const { data, isLoading } = useListContext<Client & { id: Identifier }>();

  if (isLoading) {
    return <Box sx={{ p: 2 }}>Loading...</Box>;
  }

  return (
    <Stack spacing={3} sx={{ p: 2 }}>
      {data?.map((record) => (
        <Card key={record.id} className="border-l-4 border-l-primary">
          <CardHeader
            title={record.nom}
            subheader={record.ref}
            action={
              <Stack alignItems="flex-end" spacing={1}>
                <RowActions<Client & { id: Identifier }>
                  resource="api/clients"
                  record={record}
                />
                {record.privilegie && (
                  <Chip
                    label="PRIVILEGIE"
                    sx={{
                      backgroundColor: orange[500],
                      color: "white",
                      fontWeight: 500,
                      fontSize: 12,
                    }}
                  />
                )}
              </Stack>
            }
          />
          <CardContent>
            <Stack spacing={2}>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground font-medium">
                    ADRESSE
                  </p>
                  <p className="text-foreground">{record.adresse}</p>
                </div>
              </div>
              {record.account && (
                <div>
                  <p className="text-xs text-muted-foreground font-medium">
                    COMPTE UTILISATEUR
                  </p>
                  <AccountUsernameField record={record} />
                </div>
              )}
            </Stack>
          </CardContent>
        </Card>
      ))}
    </Stack>
  );
};

export const ClientList = () => {
  const isSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.down("sm"));

  return (
    <List filters={filters}>
      {isSmall ? (
        <MobileClientList />
      ) : (
        <Datagrid rowClick={false}>
          <TextField source="ref" label="Référence" />
          <TextField source="nom" label="Nom" />
          <TextField source="adresse" label="Adresse" />
          <ReferenceField
            source="account"
            reference="api/users"
            link={false}
            label="Compte"
          >
            <TextField source="username" />
          </ReferenceField>
          <BooleanField source="privilegie" label="Privilégié" />
          <RowActions resource="api/clients" />
        </Datagrid>
      )}
    </List>
  );
};
