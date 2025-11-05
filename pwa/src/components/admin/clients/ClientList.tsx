import {
  List,
  Datagrid,
  TextField,
  BooleanInput,
  SearchInput,
  useListContext,
  Identifier,
  FunctionField,
} from "react-admin";
import {
  type Theme,
  useMediaQuery,
  Box,
  Stack,
  Chip,
  Card,
  CardHeader,
  CardContent,
} from "@mui/material";
import RowActions from "@/components/admin/common/row-actions";
import { Client } from "@/types/resources/Client";
import { orange } from "@mui/material/colors";
import { UserReferenceField } from "@/components/admin/common/fields/UserReferenceField";

const filters = [
  <SearchInput key="search" source="ref" alwaysOn />,
  <BooleanInput key="privilegie" source="privilegie" label="Privilégié" />,
];

const PrivilegieChip = ({
  isPrivilegie,
}: {
  isPrivilegie: boolean | undefined;
}) => {
  if (!isPrivilegie) return null;

  return (
    <Chip
      label="PRIVILÉGIÉ"
      sx={{
        backgroundColor: orange[500],
        color: "white",
        fontSize: 12,
        borderRadius: 10,
        px: 1,
      }}
    />
  );
};

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
                <PrivilegieChip isPrivilegie={record.privilegie} />
              </Stack>
            }
          />
          <CardContent>
            <Stack spacing={2}>
              <div>
                <p className="text-muted-foreground font-medium">ADRESSE</p>
                <p className="text-foreground">{record.adresse}</p>
              </div>
              <div>
                <p className="text-muted-foreground font-medium">UTILISATEUR</p>
                <UserReferenceField label="Utilisateur" record={record} />
              </div>
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
          <UserReferenceField label="Utilisateur" />
          <FunctionField<Client>
            label="privilegie"
            render={(record) => (
              <PrivilegieChip isPrivilegie={record.privilegie} />
            )}
          />
          <RowActions resource="api/clients" />
        </Datagrid>
      )}
    </List>
  );
};
