import {
  Show,
  SimpleShowLayout,
  TextField,
  DateField,
  NumberField,
  ReferenceField,
} from "react-admin";

export const PresenceShow = () => (
  <Show>
    <SimpleShowLayout>
      <TextField source="ref" />
      <DateField source="datePresence" />
      <ReferenceField source="employe" reference="api/employes">
        <TextField source="nom" />
      </ReferenceField>
      <ReferenceField source="production" reference="api/productions">
        <TextField source="ref" />
      </ReferenceField>
      <TextField source="statut" />
      <NumberField source="tempsPresence" label="Temps de Présence (H)" />
      <DateField source="heureDebut" showTime />
      <DateField source="heureFin" showTime />
    </SimpleShowLayout>
  </Show>
);
