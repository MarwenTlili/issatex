import {
  List,
  Datagrid,
  TextField,
  SimpleList,
  SearchInput,
  useRecordContext,
} from "react-admin";
import { useMediaQuery, Theme } from "@mui/material";
import { Ilot } from "@/types/resources/Ilot";
import RowActions from "@/components/admin/common/row-actions";

const ilotListFilters = [<SearchInput key="search" source="ref" alwaysOn />];

const RefField = () => {
  const record = useRecordContext<Ilot>();
  if (!record) return null;

  return (
    <TextField
      source="ref"
      title={record.ref}
      sx={{
        maxWidth: 150,
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        display: "block",
      }}
    />
  );
};

export const IlotList = () => {
  const isSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.down("sm"));

  return (
    <List filters={ilotListFilters}>
      {isSmall ? (
        // Mobile display
        <SimpleList
          primaryText={(record) => record.nom}
          secondaryText={(record) => record.description}
          tertiaryText={(record) => record.ref}
        />
      ) : (
        // Desktop display
        <Datagrid rowClick={false}>
          <RefField />
          <TextField source="nom" />
          <TextField
            source="description"
            sx={{
              display: "-webkit-box",
              WebkitLineClamp: 1,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: 250,
            }}
          />
          <RowActions<Ilot> resource="api/ilots" />
        </Datagrid>
      )}
    </List>
  );
};
