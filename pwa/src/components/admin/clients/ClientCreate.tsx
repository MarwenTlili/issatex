import {
  Create,
  SimpleForm,
  TextInput,
  BooleanInput,
  ReferenceInput,
  AutocompleteInput,
  required,
  email,
} from "react-admin";

export const ClientCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="nom" validate={[required()]} fullWidth />
      <TextInput source="adresse" multiline fullWidth />
      <BooleanInput source="privilegie" defaultValue={false} />
      <ReferenceInput source="account" reference="api/users">
        <AutocompleteInput optionText="username" validate={[required()]} />
      </ReferenceInput>
    </SimpleForm>
  </Create>
);
