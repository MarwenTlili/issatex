import {
  Edit,
  SimpleForm,
  TextInput,
  SelectInput,
  ReferenceInput,
  required,
  Toolbar,
  SaveButton,
  useRecordContext,
} from "react-admin";
import { statutChoices } from "./MachineList";
import { Machine } from "@/types/resources/Machine";
import { useFormState } from "react-hook-form";

const CustomToolbar = () => {
  const { isValid, isSubmitting } = useFormState();

  return (
    <Toolbar>
      <SaveButton disabled={!isValid || isSubmitting} alwaysEnable={false} />
    </Toolbar>
  );
};

const CustomTitle = () => {
  const record = useRecordContext<Machine>();
  return `${record?.ref}`;
};

export const MachineEdit = () => {
  return (
    <Edit title={<CustomTitle />} redirect="list">
      <SimpleForm toolbar={<CustomToolbar />}>
        <TextInput source="ref" disabled />
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
    </Edit>
  );
};
