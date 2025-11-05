import { Show, SimpleShowLayout, TextField } from "react-admin";
import { ClientReferenceField } from "@/components/admin/common/fields/ClientReferenceField";
import { OrdreFabricationsReferenceArrayField } from "@/components/admin/common/fields/OrdreFabricationsReferenceArrayField";

export const ArticleShow = () => (
  <Show>
    <SimpleShowLayout>
      <TextField source="ref" />
      <TextField source="designation" />
      <TextField source="composition" />
      <ClientReferenceField label="Client" />
      <OrdreFabricationsReferenceArrayField label="Ordres de Fabrication" />
    </SimpleShowLayout>
  </Show>
);
