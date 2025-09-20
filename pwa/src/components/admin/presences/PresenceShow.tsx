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
      <TextField source="statut" />
      <NumberField source="tempsPresence" label="Temps de Présence (H)" />
      <DateField
        source="heureDebut"
        showTime
        showDate={false}
        options={{ timeZone: "UTC", hour: "2-digit", minute: "2-digit" }}
      />
      <DateField
        source="heureFin"
        showTime
        showDate={false}
        options={{ timeZone: "UTC", hour: "2-digit", minute: "2-digit" }}
      />
    </SimpleShowLayout>
  </Show>
);
