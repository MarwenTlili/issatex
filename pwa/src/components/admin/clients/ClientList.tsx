import {
  List,
  Datagrid,
  TextField,
  BooleanField,
  ReferenceField,
  TextInput,
  BooleanInput,
  SearchInput,
} from "react-admin";

const filters = [
  <SearchInput key="search" source="ref" alwaysOn />,
  <BooleanInput key="privilegie" source="privilegie" label="Privilégié" />,
];

export const ClientList = () => (
  <List filters={filters}>
    <Datagrid rowClick="show">
      <TextField source="ref" />
      <TextField source="nom" />
      <TextField source="adresse" />
      <BooleanField source="privilegie" />
      <ReferenceField source="account" reference="api/users" link="show">
        <TextField source="username" />
      </ReferenceField>
    </Datagrid>
  </List>
);
