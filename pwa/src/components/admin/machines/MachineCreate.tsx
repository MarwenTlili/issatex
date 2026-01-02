import {
  Create,
  SimpleForm,
  TextInput,
  SelectInput,
  ReferenceInput,
  required,
} from "react-admin";
import { statutChoices } from "./MachineList";

export const MachineCreate = () => {
  return (
    <Create redirect="list">
      <SimpleForm>
        <TextInput source="nom" validate={[required()]} />
        <TextInput source="type" validate={[required()]} />
        <SelectInput
          source="statut"
          choices={statutChoices}
          validate={[required()]}
        />
        <ReferenceInput source="ilot" reference="api/ilots">
          <SelectInput optionText="nom" />
        </ReferenceInput>
      </SimpleForm>
    </Create>
  );
};
