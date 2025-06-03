import {
  List,
  Datagrid,
  TextField,
  ReferenceField,
  ReferenceInput,
  AutocompleteInput,
  SearchInput,
} from "react-admin";

const filters = [
  <SearchInput key="search" source="ref" alwaysOn />,
  <ReferenceInput key="client" source="client" reference="api/clients">
    <AutocompleteInput optionText="nom" label="Client" />
  </ReferenceInput>,
];

export const ArticleList = () => (
  <List filters={filters}>
    <Datagrid rowClick="show">
      <TextField source="ref" />
      <TextField source="designation" />
      <ReferenceField source="client" reference="api/clients" link="show">
        <TextField source="nom" />
      </ReferenceField>
      <ReferenceField
        label="email"
        source="client"
        reference="api/clients"
        link={false}
      >
        <ReferenceField source="account" reference="api/users" link={false}>
          <TextField source="email" />
        </ReferenceField>
      </ReferenceField>
    </Datagrid>
  </List>
);
