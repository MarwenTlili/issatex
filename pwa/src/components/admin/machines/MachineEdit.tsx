import {
  Edit,
  SimpleForm,
  TextInput,
  SelectInput,
  ReferenceInput,
  required,
} from "react-admin";

const statusChoices = [
  { id: "Fonctionnelle", name: "Fonctionnelle" },
  { id: "En Panne", name: "En Panne" },
  { id: "En Maintenance", name: "En Maintenance" },
  { id: "En Arretee", name: "En Arrêtée" },
  { id: "En Cours De Reparation", name: "En Cours De Réparation" },
  { id: "Disponible", name: "Disponible" },
  { id: "Indisponible", name: "Indisponible" },
];

export const MachineEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="ref" disabled />
      <TextInput source="nom" validate={[required()]} />
      <TextInput source="type" validate={[required()]} />
      <SelectInput
        source="statut"
        choices={statusChoices}
        validate={[required()]}
      />
      <ReferenceInput source="ilot" reference="api/ilots">
        <SelectInput optionText="nom" />
      </ReferenceInput>
    </SimpleForm>
  </Edit>
);
