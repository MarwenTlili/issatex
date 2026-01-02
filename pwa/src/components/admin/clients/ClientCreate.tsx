import {
  Create,
  SimpleForm,
  TextInput,
  BooleanInput,
  ReferenceInput,
  AutocompleteInput,
  required,
} from "react-admin";

export const ClientCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="nom" validate={[required()]} />
      <TextInput source="adresse" multiline />
      <BooleanInput source="privilegie" defaultValue={false} />
      <ReferenceInput source="account" reference="api/users">
        <AutocompleteInput optionText="username" validate={[required()]} />
      </ReferenceInput>
    </SimpleForm>
  </Create>
);
