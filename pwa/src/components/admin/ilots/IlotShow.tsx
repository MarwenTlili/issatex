import {
  Show,
  SimpleShowLayout,
  TextField,
  ReferenceManyField,
  Datagrid,
  ReferenceField,
  BooleanField,
  DateField,
} from "react-admin";

export const IlotShow = () => (
  <Show>
    <SimpleShowLayout>
      <TextField source="ref" label="Reference" />
      <TextField source="nom" label="Name" />
      <TextField source="description" label="Description" />

      <ReferenceManyField
        label="Machines"
        reference="api/machines"
        target="ilot"
      >
        <Datagrid>
          <TextField source="ref" label="Reference" />
          <TextField source="nom" label="Name" />
          <TextField source="type" label="Type" />
          <TextField source="statut" label="Status" />
        </Datagrid>
      </ReferenceManyField>

      <ReferenceManyField
        label="Planning"
        reference="api/plannings"
        target="ilot"
      >
        <Datagrid>
          <TextField source="ref" label="Reference" />
          <ReferenceField
            source="ordreFabrication"
            reference="api/ordre_fabrications"
            label="Ordre de Fabrication"
          >
            <TextField source="ref" />
          </ReferenceField>
          <DateField source="dateDebut" label="Date de début" />
          <DateField source="dateFin" label="Date de fin" />
          <BooleanField source="reporte" label="reporté" />
        </Datagrid>
      </ReferenceManyField>

      <ReferenceManyField
        label="Employes"
        reference="api/affectation_employe_ilots"
        target="ilot"
      >
        <Datagrid>
          <ReferenceField source="employe" reference="api/employes">
            <TextField source="nom" />
            <TextField source="prenom" />
          </ReferenceField>
          <ReferenceField
            source="employe"
            reference="api/employes"
            label="Poste"
            link={false}
          >
            <TextField source="poste" />
          </ReferenceField>
          <BooleanField source="responsable" label="résponsable" />
        </Datagrid>
      </ReferenceManyField>
    </SimpleShowLayout>
  </Show>
);
