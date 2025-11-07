import { Employe } from "@/types/resources/Employe";
import {
  Show,
  SimpleShowLayout,
  TextField,
  useRecordContext,
} from "react-admin";
import { AffectationsReferenceArrayField } from "@/components/admin/common/fields/AffectationsReferenceArrayField";
import { PresencesReferenceArrayField } from "@/components/admin/common/fields/PresencesReferenceArrayField";

const CustomTitle = () => {
  const record = useRecordContext<Employe>();
  return `${record?.ref || ""}`;
};

export const EmployeShow = () => {
  return (
    <Show title={<CustomTitle />}>
      <SimpleShowLayout>
        <TextField source="ref" label="Reference" />
        <TextField source="nom" label="Nom" />
        <TextField source="prenom" label="Prénom" />
        <TextField source="poste" label="Poste" />
        <AffectationsReferenceArrayField label="Affectations" />
        <PresencesReferenceArrayField label="Presences" />
      </SimpleShowLayout>
    </Show>
  );
};
