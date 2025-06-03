import {
  Show,
  SimpleShowLayout,
  TextField,
  BooleanField,
  ReferenceField,
  ReferenceManyField,
  Datagrid,
  DateField,
} from "react-admin";

export const ClientShow = () => (
  <Show>
    <SimpleShowLayout>
      <TextField source="ref" />
      <TextField source="nom" />
      <TextField source="adresse" />
      <BooleanField source="privilegie" />
      <ReferenceField source="account" reference="api/users" link="show">
        <TextField source="username" />
      </ReferenceField>

      <ReferenceManyField label="Articles" reference="api/articles" target="client">
        <Datagrid rowClick="show">
          <TextField source="ref" />
          <TextField source="designation" />
        </Datagrid>
      </ReferenceManyField>

      <ReferenceManyField
        label="Ordres de Fabrication"
        reference="api/ordre_fabrications"
        target="client"
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
