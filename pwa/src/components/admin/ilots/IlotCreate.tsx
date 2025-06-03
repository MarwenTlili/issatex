import { Create, SimpleForm, TextInput, required } from "react-admin";

export const IlotCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="nom" validate={[required()]} fullWidth />
      <TextInput source="description" multiline rows={4} fullWidth />
    </SimpleForm>
  </Create>
);
