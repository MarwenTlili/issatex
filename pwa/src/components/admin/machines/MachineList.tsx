import {
  List,
  Datagrid,
  TextField,
  ReferenceField,
  CreateButton,
  TopToolbar,
  FilterButton,
  SearchInput,
  SelectInput,
  ReferenceInput,
} from "react-admin";
import RowActions from "@/components/admin/common/row-actions";
import { STATUTS } from "@/types/resources/Machine";

// array of choices for React-Admin SelectInput component (id, name)
export const statutChoices = STATUTS.map((s) => ({ id: s, name: s }));

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

export const MachineList = () => (
  <List
    filters={MachineFilters}
    actions={<MachineListActions />}
    sort={{ field: "nom", order: "ASC" }}
  >
    <Datagrid rowClick={false}>
      <TextField source="ref" label="Reference" />
      <TextField source="nom" label="Name" />
      <TextField source="type" label="Type" />
      <TextField source="statut" label="Status" />
      <ReferenceField source="ilot" reference="api/ilots" label="Ilot">
        <TextField source="nom" />
      </ReferenceField>
      <RowActions resource="api/machines" />
    </Datagrid>
  </List>
);
