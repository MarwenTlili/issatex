import {
  Edit,
  SimpleForm,
  TextInput,
  BooleanInput,
  required,
  email,
} from "react-admin";

export const ClientEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="ref" disabled />
      <TextInput source="nom" validate={[required()]} />
      <TextInput source="adresse" multiline rows={3} />
      <BooleanInput source="privilegie" />
    </SimpleForm>
  </Edit>
);
