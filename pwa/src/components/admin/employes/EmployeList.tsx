import {
  List,
  Datagrid,
  TextField,
  CreateButton,
  TopToolbar,
  FilterButton,
  SearchInput,
  SelectInput,
  FunctionField,
  Identifier,
  useListContext,
} from "react-admin";
import {
  useMediaQuery,
  Theme,
  Box,
  Stack,
  Card,
  CardHeader,
  CardContent,
} from "@mui/material";
import RowActions from "@/components/admin/common/row-actions";
import { Employe } from "@/types/resources/Employe";

const employePostChoices = [
  { id: "Tisseur", name: "Tisseur" },
  { id: "Fileur", name: "Fileur" },
  { id: "Teinturier", name: "Teinturier" },
  { id: "Imprimeur", name: "Imprimeur" },
  { id: "Couturier", name: "Couturier" },
  { id: "Tailleurs", name: "Tailleurs" },
  { id: "Opérateur de machine", name: "Opérateur de machine" },
];

const EmployeFilters = [
  <SearchInput key="search" source="ref" alwaysOn />,
  <SelectInput key="poste" source="poste" choices={employePostChoices} />,
];

const EmployeListActions = () => (
  <TopToolbar>
    <FilterButton />
    <CreateButton />
  </TopToolbar>
);

const MobileEmployeList = () => {
  const { data, isLoading } = useListContext<Employe & { id: Identifier }>();

  if (isLoading) {
    return <Box sx={{ p: 2 }}>Loading...</Box>;
  }

  return (
    <Stack spacing={3} sx={{ p: 2 }}>
      {data?.map((record) => (
        <Card key={record.id} className="border-l-4 border-l-primary">
          <CardHeader
            title={`${record.nom} ${record.prenom}`}
            subheader={record.ref}
            action={
              <Stack alignItems="flex-end" spacing={1}>
                <RowActions<Employe> resource="api/employes" record={record} />
              </Stack>
            }
          />
          <CardContent>
            <Stack spacing={2}>
              <div>
                <p className="text-muted-foreground font-medium">POSTE</p>
                <p className="text-foreground">{record.poste}</p>
              </div>
            </Stack>
          </CardContent>
        </Card>
      ))}
    </Stack>
  );
};

export const EmployeList = () => {
  const isSmall = useMediaQuery((theme: Theme) => theme.breakpoints.down("sm"));

  return (
    <List filters={EmployeFilters} actions={<EmployeListActions />}>
      {isSmall ? (
        <MobileEmployeList />
      ) : (
        <Datagrid rowClick={false}>
          <TextField source="ref" label="Ref" sx={{ whiteSpace: "nowrap" }} />
          <TextField source="nom" label="Nom" />
          <TextField source="prenom" label="Prénom" />
          <TextField source="poste" label="Poste" />
          <FunctionField
            label="Affecté?"
            render={(record: Employe) =>
              record.affectations && record.affectations.length > 0
                ? "Oui"
                : "Non"
            }
          />
          <FunctionField
            label="Présences"
            render={(record: Employe) =>
              record.presences ? record.presences.length : 0
            }
          />
          <RowActions<Employe> resource="api/employes" />
        </Datagrid>
      )}
    </List>
  );
};
