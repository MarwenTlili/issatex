import {
  Create,
  SimpleForm,
  TextInput,
  SelectInput,
  ReferenceInput,
  required,
} from "react-admin";
import { statutChoices } from "./MachineList";
import { Machine } from "@/types/resources/Machine";

export const MachineCreate = () => {
  return (
    <Create<Machine> redirect="list">
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
