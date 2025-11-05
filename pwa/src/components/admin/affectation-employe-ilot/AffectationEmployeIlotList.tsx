import {
  List,
  Datagrid,
  TextField,
  ReferenceInput,
  SelectInput,
  TopToolbar,
  CreateButton,
  ExportButton,
  FilterButton,
  useListContext,
  Identifier,
  Link,
  FunctionField,
} from "react-admin";
import RowActions from "@/components/admin/common/row-actions";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Stack,
  Theme,
  useMediaQuery,
} from "@mui/material";
import { AffectationEmployeIlot } from "@/types/resources/AffectationEmployeIlot";

const assignmentFilters = [
  // <SearchInput source="q" alwaysOn key="search" />,
  <ReferenceInput source="employe" reference="api/employes" key="employe">
    <SelectInput optionText="ref" />
  </ReferenceInput>,
  <ReferenceInput source="ilot" reference="api/ilots" key="ilot">
    <SelectInput optionText="nom" />
  </ReferenceInput>,
];

const AssignmentListActions = () => (
  <TopToolbar>
    <FilterButton />
    <CreateButton />
    <ExportButton />
  </TopToolbar>
);

const ResponsableChip = ({ isResponsable }: { isResponsable: boolean }) => {
  if (!isResponsable) return null;
  return <Chip label="Responsable" />;
};

const IlotField = ({ record }: { record: AffectationEmployeIlot }) => {
  return (
    <Link to={`/api/ilots/${encodeURIComponent(record.ilot["@id"])}/show`}>
      {record.ilot.nom}
    </Link>
  );
};

const MobileEmployeList = () => {
  const { data, isLoading } = useListContext<
    AffectationEmployeIlot & { id: Identifier }
  >();

  if (isLoading) {
    return <Box sx={{ p: 2 }}>Loading...</Box>;
  }

  return (
    <Stack spacing={3} sx={{ p: 2 }}>
      {data?.map((record) => (
        <Card key={record.id} className="border-l-4 border-l-primary">
          <CardHeader
            title={record.ref}
            subheader={`${record.employe.nom} ${record.employe.prenom}`}
            action={
              <Stack alignItems="flex-end" spacing={1}>
                <RowActions<AffectationEmployeIlot>
                  resource="api/affectation_employe_ilots"
                  record={record}
                />
                <ResponsableChip isResponsable={record.responsable} />
              </Stack>
            }
          />
          <CardContent>
            <Stack spacing={2}>
              <p className="text-muted-foreground font-medium">ILOT</p>
              <p className="text-foreground">
                <IlotField record={record} />
              </p>
            </Stack>
          </CardContent>
        </Card>
      ))}
    </Stack>
  );
};

export const AffectationEmployeIlotList = () => {
  const isSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.down("sm"));

  return (
    <List filters={assignmentFilters} actions={<AssignmentListActions />}>
      {isSmall ? (
        <MobileEmployeList />
      ) : (
        <Datagrid rowClick={false}>
          <TextField
            source="ref"
            label="Reference"
            sx={{ whiteSpace: "nowrap" }}
          />
          <TextField source="employe.nom" label="Nom Emp" />
          <TextField source="employe.prenom" label="Prenom Emp" />
          <TextField source="employe.poste" label="Position" />
          <FunctionField
            label="Ilot"
            render={(record) => <IlotField record={record} />}
          />
          <FunctionField
            label="Est Responsable"
            render={(record) => (
              <ResponsableChip isResponsable={record.responsable} />
            )}
          />
          <RowActions resource="api/affectation_employe_ilots" />
        </Datagrid>
      )}
    </List>
  );
};
