import { List, Datagrid, TextField, SearchInput } from "react-admin";

const filters = [<SearchInput key="search" source="ref" alwaysOn />];

export const IlotList = () => (
  <List filters={filters}>
    <Datagrid rowClick="show">
      <TextField source="ref" />
      <TextField source="nom" />
      <TextField source="description" />
    </Datagrid>
  </List>
);
