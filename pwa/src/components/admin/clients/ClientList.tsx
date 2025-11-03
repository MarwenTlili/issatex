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
} from "react-admin";
import {
  type Theme,
  useMediaQuery,
  Box,
  Stack,
  Chip,
  CircularProgress,
} from "@mui/material";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import RowActions from "@/components/admin/common/row-actions";
import { Client } from "@/types/resources/Client";
import { User } from "@/types/resources/User";

export const AccountUsernameField = ({ record }: { record: Client }) => {
  const { data, isLoading, error } = useGetOne<User>("api/users", {
    id: record?.account as unknown as number | undefined,
  });

  if (!record?.account) {
    return <Box>—</Box>;
  }

  if (isLoading) {
    return <CircularProgress size={16} />;
  }

  if (error) {
    return <Box className="text-destructive text-xs">Error loading</Box>;
  }

  return <Box>{data?.username || "—"}</Box>;
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
          <CardHeader>
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1">
                <h3 className="font-bold text-lg">{record.nom}</h3>
                <p className="text-sm text-muted-foreground">{record.ref}</p>
              </div>
              {record.privilegie && (
                <Chip
                  label="Privilégié"
                  size="small"
                  color="warning"
                  variant="outlined"
                />
              )}
              <RowActions<Client & { id: Identifier }>
                  resource="api/clients"
                  record={record}
                />
            </div>
          </CardHeader>
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
  const isSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.down("md"));

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
