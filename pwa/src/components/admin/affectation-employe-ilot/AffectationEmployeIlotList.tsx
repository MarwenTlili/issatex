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
} from "react-admin";
import RowActions from "@/components/admin/common/row-actions";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Stack,
  Theme,
  useMediaQuery,
} from "@mui/material";
import { AffectationEmployeIlot } from "@/types/resources/AffectationEmployeIlot";
import { EmployeFunctionField } from "@/components/admin/common/fields/EmployeFunctionField";
import { IlotFunctionField } from "@/components/admin/common/fields/IlotFunctionField";
import { ResponsableFunctionField } from "../common/fields/ResponsableFunctionField";

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

const MobileAffectationsList = () => {
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
            subheader={<EmployeFunctionField label="Employe" record={record} />}
            action={
              <Stack alignItems="flex-end" spacing={1}>
                <RowActions<AffectationEmployeIlot>
                  resource="api/affectation_employe_ilots"
                  record={record}
                />
                <ResponsableFunctionField
                  label="Est Responsable"
                  record={record}
                />
              </Stack>
            }
          />
          <CardContent>
            <Stack spacing={2}>
              <p className="text-muted-foreground font-medium">ILOT</p>
              <p className="text-foreground">
                <IlotFunctionField label="Ilot" record={record} />
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
        <MobileAffectationsList />
      ) : (
        <Datagrid rowClick={false}>
          <TextField
            source="ref"
            label="Reference"
            sx={{ whiteSpace: "nowrap" }}
          />
          <EmployeFunctionField label="Employe" />
          <IlotFunctionField label="Ilot" />
          <ResponsableFunctionField label="Responsable?" />
          <RowActions resource="api/affectation_employe_ilots" />
        </Datagrid>
      )}
    </List>
  );
};
