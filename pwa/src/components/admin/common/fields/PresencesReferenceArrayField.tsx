import React from "react";
import {
  Datagrid,
  FunctionField,
  ReferenceArrayField,
  SimpleList,
  TextField,
} from "react-admin";
import { useMediaQuery, Theme, Chip } from "@mui/material";
import { Presence, PRESENCE_STATUT } from "@/types/resources/Presence";
import { formatDate } from "@/lib/utils/date";

const StatutChip = ({ statut }: { statut: Presence["statut"] }) => {
  const { label, muiColor } = PRESENCE_STATUT[statut];
  return (
    <Chip
      label={label}
      size="small"
      color={muiColor}
      variant="filled"
      sx={{ fontWeight: 600 }}
    />
  );
};

export const PresencesReferenceArrayField = (props: any) => {
  const isSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.down("sm"));

  return (
    <ReferenceArrayField<Presence>
      source="presences"
      reference="api/presences"
      {...props}
    >
      {isSmall ? (
        <SimpleList
          primaryText={(record) => record.ref}
          secondaryText={(record) => formatDate(record.datePresence)}
          tertiaryText={(record) => <StatutChip statut={record.statut} />}
        />
      ) : (
        <Datagrid bulkActionButtons={false}>
          <TextField source="ref" />
          <FunctionField<Presence>
            label="Date de présence"
            render={(record) => formatDate(record.datePresence)}
          />
          <FunctionField<Presence>
            label="Statut"
            render={(record) => <StatutChip statut={record.statut} />}
          />
        </Datagrid>
      )}
    </ReferenceArrayField>
  );
};
