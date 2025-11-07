import {
  List,
  Datagrid,
  TextField,
  CreateButton,
  TopToolbar,
  FilterButton,
  SearchInput,
  SelectInput,
  ReferenceInput,
  useListContext,
  Identifier,
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
import { Machine, MACHINE_STATUT } from "@/types/resources/Machine";
import { IlotReferenceField } from "@/components/admin/common/fields/IlotReferenceField";

// array of choices for React-Admin SelectInput component (id, name)
export const statutChoices = Object.entries(MACHINE_STATUT).map(
  ([value, statut]) => ({
    id: value,
    name: statut.label,
  })
);

const MachineFilters = [
  <SearchInput key="search" source="ref" alwaysOn />,
  <SelectInput
    key="statut"
    source="statut"
    label="Status"
    choices={statutChoices}
  />,
  <ReferenceInput key="ilot" source="ilot" reference="api/ilots">
    <SelectInput optionText="nom" />
  </ReferenceInput>,
];

const MachineListActions = () => (
  <TopToolbar>
    <FilterButton />
    <CreateButton />
  </TopToolbar>
);

const MobileMachineList = () => {
  const { data, isLoading } = useListContext<Machine & { id: Identifier }>();

  if (isLoading) {
    return <Box sx={{ p: 2 }}>Loading...</Box>;
  }

  return (
    <Stack spacing={3} sx={{ p: 2 }}>
      {data?.map((record) => (
        <Card key={record.id} className="border-l-4 border-l-primary">
          <CardHeader
            action={
              <Stack alignItems="flex-end" spacing={1}>
                <RowActions<Machine> resource="api/machines" record={record} />
                <Chip
                  label={record.statut}
                  color={MACHINE_STATUT[record.statut].muiColor}
                />
              </Stack>
            }
            title={record.nom}
            subheader={record.ref}
          />
          <CardContent>
            <Stack spacing={2}>
              <div>
                <p className="text-muted-foreground font-medium">TYPE</p>
                <p className="text-foreground">{record.type}</p>
              </div>
              <div>
                <p className="text-muted-foreground font-medium">ILOT</p>
                <IlotReferenceField label="Ilot" record={record} />
              </div>
            </Stack>
          </CardContent>
        </Card>
      ))}
    </Stack>
  );
};

export const MachineList = () => {
  const isSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.down("sm"));

  return (
    <List
      filters={MachineFilters}
      actions={<MachineListActions />}
      sort={{ field: "nom", order: "ASC" }}
    >
      {isSmall ? (
        <MobileMachineList />
      ) : (
        <Datagrid rowClick={false}>
          <TextField source="ref" label="Reference" />
          <TextField source="nom" label="Name" />
          <TextField source="type" label="Type" />
          <FunctionField<Machine>
            render={(record) => (
              <Chip
                label={record.statut}
                color={MACHINE_STATUT[record.statut].muiColor}
              />
            )}
          />
          <IlotReferenceField label="Ilot" />
          <RowActions resource="api/machines" />
        </Datagrid>
      )}
    </List>
  );
};
