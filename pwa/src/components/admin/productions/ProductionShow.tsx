import {
  Show,
  SimpleShowLayout,
  TextField,
  DateField,
  NumberField,
  ReferenceField,
  ReferenceManyField,
  Datagrid,
} from "react-admin";

export const ProductionShow = () => (
  <Show>
    <SimpleShowLayout>
      <TextField source="ref" />
      <DateField source="dateProduction" />
      <ReferenceField source="planning" reference="api/plannings">
        <TextField source="ref" />
      </ReferenceField>
      <TextField source="tailleArticle" />
      <NumberField source="quantitePremiereChoix" />
      <NumberField source="quantiteDeuxiemeChoix" />
      <NumberField source="quantiteTotale" />
    </SimpleShowLayout>
  </Show>
);
