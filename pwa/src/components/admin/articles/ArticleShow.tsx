import {
  Show,
  SimpleShowLayout,
  TextField,
  useRecordContext,
} from "react-admin";
import { ClientReferenceField } from "@/components/admin/common/fields/ClientReferenceField";
import { OrdreFabricationsReferenceArrayField } from "@/components/admin/common/fields/OrdreFabricationsReferenceArrayField";
import { Article } from "@/types/resources/Article";

const CustomTitle = () => {
  const record = useRecordContext<Article>();
  return `${record?.ref}`;
};

export const ArticleShow = () => (
  <Show title={<CustomTitle />}>
    <SimpleShowLayout>
      <TextField source="ref" />
      <TextField source="designation" />
      <TextField source="composition" />
      <ClientReferenceField label="Client" />
      <OrdreFabricationsReferenceArrayField label="Ordres de Fabrication" />
    </SimpleShowLayout>
  </Show>
);
