import { formatDecimalHours } from "@/lib/utils/date";
import {
  Show,
  SimpleShowLayout,
  TextField,
  DateField,
  FunctionField,
} from "react-admin";

export const PresenceShow = () => (
  <Show>
    <SimpleShowLayout>
      <TextField source="ref" />
      <DateField source="datePresence" />
      <FunctionField
        source="employe"
        render={(record) =>
          `${record.employe.nom} - ${record.employe.prenom} (${record.employe.ref})`
        }
      />
      <TextField source="statut" />
      <FunctionField
        label="Temps de Présence"
        render={(record) => formatDecimalHours(record.tempsPresence)}
      />
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
