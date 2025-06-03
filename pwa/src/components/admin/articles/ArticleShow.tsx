import {
  Show,
  SimpleShowLayout,
  TextField,
  ReferenceField,
  ReferenceManyField,
  Datagrid,
  DateField,
} from "react-admin";

export const ArticleShow = () => (
  <Show>
    <SimpleShowLayout>
      <TextField source="ref" />
      <TextField source="designation" />
      <TextField source="composition" />
      <ReferenceField source="client" reference="api/clients" link="show">
        <TextField source="nom" />
      </ReferenceField>
      <ReferenceField
        label="email"
        source="client"
        reference="api/clients"
        link={false}
      >
        <ReferenceField source="account" reference="api/users" link={false}>
          <TextField source="email" />
        </ReferenceField>
      </ReferenceField>
      <ReferenceManyField
        label="Ordres de Fabrication"
        reference="api/ordre_fabrications"
        target="article"
      >
        <Datagrid rowClick="show">
          <TextField source="ref" />
          <DateField source="dateCreation" />
          <DateField source="dateCloture" />
          <TextField source="statut" />
          <TextField source="quantiteTotale" />
        </Datagrid>
      </ReferenceManyField>
    </SimpleShowLayout>
  </Show>
);
