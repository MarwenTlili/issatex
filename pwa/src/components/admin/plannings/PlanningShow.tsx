import {
  Show,
  SimpleShowLayout,
  TextField,
  DateField,
  ReferenceField,
  BooleanField,
  ReferenceManyField,
  Datagrid,
  NumberField,
} from "react-admin";

export const PlanningShow = () => (
  <Show>
    <SimpleShowLayout>
      <TextField source="ref" />
      <DateField source="dateCreation" />
      <DateField source="dateDebut" />
      <DateField source="dateFin" />
      <ReferenceField
        source="ordreFabrication"
        reference="api/ordre_fabrications"
        label="Ordre De Fabrication"
      >
        <TextField source="ref" />
      </ReferenceField>
      <ReferenceField source="ilot" reference="api/ilots">
        <TextField source="nom" />
      </ReferenceField>
      <BooleanField source="reporte" label="reporté" />

      <ReferenceManyField
        label="Productions"
        reference="api/productions"
        target="planning"
      >
        <Datagrid>
          <DateField source="dateProduction" />
          <TextField source="tailleArticle" />
          <NumberField source="quantitePremiereChoix" />
          <NumberField source="quantiteDeuxiemeChoix" />
          <NumberField source="quantiteTotale" />
        </Datagrid>
      </ReferenceManyField>
    </SimpleShowLayout>
  </Show>
);
