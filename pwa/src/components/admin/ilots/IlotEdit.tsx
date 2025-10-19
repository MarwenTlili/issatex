import { Edit, SimpleForm, TextInput, required } from "react-admin";

export const IlotEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="ref" label="Réf" disabled />
      <TextInput source="nom" validate={[required()]} />
      <TextInput source="description" multiline rows={4} />
    </SimpleForm>
  </Edit>
);
