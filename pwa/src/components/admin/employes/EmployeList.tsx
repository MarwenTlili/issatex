import {
  List,
  Datagrid,
  TextField,
  EditButton,
  ShowButton,
  DeleteButton,
  CreateButton,
  TopToolbar,
  FilterButton,
  SearchInput,
  SelectInput,
} from "react-admin";

const EmployeFilters = [
  <SearchInput key="search" source="ref" alwaysOn />,
  <SelectInput
    key="poste"
    source="poste"
    choices={[
      { id: "Tisseur", name: "Tisseur" },
      { id: "Fileur", name: "Fileur" },
      { id: "Teinturier", name: "Teinturier" },
      { id: "Imprimeur", name: "Imprimeur" },
      { id: "Couturier", name: "Couturier" },
      { id: "Tailleurs", name: "Tailleurs" },
      { id: "Opérateur de machine", name: "Opérateur de machine" },
    ]}
  />,
];

const EmployeListActions = () => (
  <TopToolbar>
    <FilterButton />
    <CreateButton />
  </TopToolbar>
);

export const EmployeList = () => (
  <List filters={EmployeFilters} actions={<EmployeListActions />}>
    <Datagrid>
      <TextField source="ref" label="Ref" />
      <TextField source="nom" label="Nom" />
      <TextField source="prenom" label="Prénom" />
      <TextField source="poste" label="Poste" />
      <EditButton />
      <ShowButton />
      <DeleteButton />
    </Datagrid>
  </List>
);
