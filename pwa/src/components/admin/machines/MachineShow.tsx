import { Show, SimpleShowLayout, TextField, ReferenceField } from "react-admin";

export const MachineShow = () => (
  <Show>
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
