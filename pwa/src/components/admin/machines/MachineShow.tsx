import { Machine } from "@/types/resources/Machine";
import {
  Show,
  SimpleShowLayout,
  TextField,
  ReferenceField,
  useRecordContext,
} from "react-admin";

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
      <TextField source="statut" />
      <ReferenceField source="ilot" reference="api/ilots">
        <TextField source="nom" />
      </ReferenceField>
    </SimpleShowLayout>
  </Show>
);
