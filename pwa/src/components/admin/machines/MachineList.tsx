import {
  List,
  Datagrid,
  TextField,
  ReferenceField,
  EditButton,
  ShowButton,
  DeleteButton,
  CreateButton,
  TopToolbar,
  FilterButton,
  SearchInput,
  SelectInput,
  ReferenceInput,
} from "react-admin";

const MachineFilters = [
  <SearchInput key="search" source="ref" alwaysOn />,
  <SelectInput
    key="statut"
    source="statut"
    label="Status"
    choices={[
      { id: "Fonctionnelle", name: "Fonctionnelle" },
      { id: "En Panne", name: "En Panne" },
      { id: "En Maintenance", name: "En Maintenance" },
      { id: "En Arretee", name: "En Arrêtée" },
      { id: "En Cours De Reparation", name: "En Cours De Réparation" },
      { id: "Disponible", name: "Disponible" },
      { id: "Indisponible", name: "Indisponible" },
    ]}
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
    <Datagrid>
      <TextField source="ref" label="Reference" />
      <TextField source="nom" label="Name" />
      <TextField source="type" label="Type" />
      <TextField source="statut" label="Status" />
      <ReferenceField source="ilot" reference="api/ilots" label="Ilot">
        <TextField source="nom" />
      </ReferenceField>
      <EditButton />
      <ShowButton />
      <DeleteButton />
    </Datagrid>
  </List>
);
