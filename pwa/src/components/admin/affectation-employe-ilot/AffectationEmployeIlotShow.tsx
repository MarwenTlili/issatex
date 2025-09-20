import React from "react";
import {
  TextField,
  BooleanField,
  Show,
  SimpleShowLayout,
  ReferenceField,
} from "react-admin";

export const AffectationEmployeIlotShow = () => {
  return (
    <Show>
      <SimpleShowLayout
        sx={{
          "& .RaSimpleShowLayout-card": {
            backgroundColor: "var(--color-card)",
          },
        }}
      >
        <TextField source="ref" label="Reference" />
        <ReferenceField source="employe" reference="employes" label="Employee">
          <TextField source="nom" />
        </ReferenceField>
        <ReferenceField
          source="employe"
          reference="employes"
          label="First Name"
        >
          <TextField source="prenom" />
        </ReferenceField>
        <ReferenceField source="employe" reference="employes" label="Position">
          <TextField source="poste" />
        </ReferenceField>
        <ReferenceField source="ilot" reference="ilots" label="Workshop">
          <TextField source="nom" />
        </ReferenceField>
        <ReferenceField
          source="ilot"
          reference="ilots"
          label="Workshop Description"
        >
          <TextField source="description" />
        </ReferenceField>
        <BooleanField source="responsable" label="Is Responsible" />
      </SimpleShowLayout>
    </Show>
  );
};
