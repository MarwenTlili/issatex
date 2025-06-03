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

      <ReferenceManyField reference="api/presences" target="production">
        <Datagrid>
          <ReferenceField
            source="employe"
            reference="api/employes"
          >
            <TextField source="nom" />
          </ReferenceField>
          <DateField source="datePresence" />
          <TextField source="statut" />
          <NumberField source="tempsPresence" />
        </Datagrid>
      </ReferenceManyField>
    </SimpleShowLayout>
  </Show>
);
