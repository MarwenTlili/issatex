import {
  Show,
  SimpleShowLayout,
  TextField,
  ReferenceField,
  useRecordContext,
  FunctionField,
} from "react-admin";
import { Chip } from "@mui/material";
import { Machine, MACHINE_STATUT } from "@/types/resources/Machine";

const CustomTitle = () => {
  const record = useRecordContext<Machine>();
  return `${record?.ref}`;
};

export const MachineShow = () => (
  <Show title={<CustomTitle />}>
    <SimpleShowLayout>
      <TextField source="ref" />
      <TextField source="nom" />
      <TextField source="type" />
      <FunctionField<Machine>
        label="Statut"
        render={(record) => (
          <Chip
            label={record.statut}
            color={MACHINE_STATUT[record.statut].muiColor}
          />
        )}
      />
      <ReferenceField source="ilot" reference="api/ilots">
        <TextField source="nom" />
      </ReferenceField>
    </SimpleShowLayout>
  </Show>
);
