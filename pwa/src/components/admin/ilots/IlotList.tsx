import {
  List,
  Datagrid,
  TextField,
  SimpleList,
  SearchInput,
  EditButton,
} from "react-admin";
import { useMediaQuery, Theme } from "@mui/material";

const filters = [<SearchInput key="search" source="ref" alwaysOn />];

export const IlotList = () => {
  const isSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.down("sm"));

  return (
    <List filters={filters}>
      {isSmall ? (
        // Vue mobile
        <SimpleList
          primaryText={(record) => record.nom}
          secondaryText={(record) => record.ref}
          tertiaryText={(record) => record.description}
        />
      ) : (
        // Vue desktop
        <Datagrid rowClick="show">
          <TextField source="ref" />
          <TextField source="nom" />
          <TextField source="description" />
          <EditButton />
        </Datagrid>
      )}
    </List>
  );
};
