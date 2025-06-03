import { Edit, SimpleForm, TextInput, required } from "react-admin";

export const IlotEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="id" disabled />
      <TextInput source="ref" fullWidth />
      <TextInput source="nom" validate={[required()]} fullWidth />
      <TextInput source="description" multiline rows={4} fullWidth />
    </SimpleForm>
  </Edit>
);
