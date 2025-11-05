import {
  Show,
  SimpleShowLayout,
  TextField,
  BooleanField,
  Labeled,
  useRecordContext,
} from "react-admin";
import { Client } from "@/types/resources/Client";
import { UserReferenceField } from "@/components/admin/common/fields/UserReferenceField";
import { ArticlesArrayField } from "@/components/admin/common/fields/ArticlesArrayField";
import { OrdreFabricationsReferenceArrayField } from "@/components/admin/common/fields/OrdreFabricationsReferenceArrayField";

const CustomTitle = () => {
  const record = useRecordContext<Client>();
  return `${record?.ref}`;
};

export const ClientShow = () => (
  <Show title={<CustomTitle />}>
    <SimpleShowLayout>
      <TextField source="ref" />
      <TextField source="nom" />
      <TextField source="adresse" />
      <BooleanField source="privilegie" />
      <UserReferenceField label="Utilisateur" />

      <Labeled source="articles">
        <ArticlesArrayField />
      </Labeled>

      <Labeled source="ordreFabrications">
        <OrdreFabricationsReferenceArrayField />
      </Labeled>
    </SimpleShowLayout>
  </Show>
);
