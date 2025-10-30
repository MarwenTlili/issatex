import { Employe } from "@/types/resources/Employe";
import {
  Show,
  SimpleShowLayout,
  TextField,
  ReferenceManyField,
  Datagrid,
  ReferenceField,
  BooleanField,
  DateField,
  useRecordContext,
} from "react-admin";

const CustomTitle = () => {
  const record = useRecordContext<Employe>();
  return `${record?.ref}`;
};

export const EmployeShow = () => (
  <Show title={<CustomTitle />}>
    <SimpleShowLayout>
      <TextField source="ref" label="Reference" />
      <TextField source="nom" label="Nom" />
      <TextField source="prenom" label="Prénom" />
      <TextField source="poste" label="Poste" />

      <ReferenceManyField
        label="Affectation E/I"
        reference="api/affectation_employe_ilots"
        target="employe"
      >
        <Datagrid>
          <ReferenceField source="ilot[@id]" reference="api/ilots" label="Ilot">
            <TextField source="ref" />
            {" - "}
            <TextField source="nom" />
          </ReferenceField>
          <BooleanField source="responsable" />
        </Datagrid>
      </ReferenceManyField>

      <ReferenceManyField
        label="Présence"
        reference="api/presences"
        target="employe"
        sort={{ field: "datePresence", order: "DESC" }}
        perPage={10}
      >
        <Datagrid>
          <DateField source="datePresence" label="Date" />
          <TextField source="statut" label="Status" />
          <TextField source="tempsPresence" label="Temps de présence" />
        </Datagrid>
      </ReferenceManyField>
    </SimpleShowLayout>
  </Show>
);
