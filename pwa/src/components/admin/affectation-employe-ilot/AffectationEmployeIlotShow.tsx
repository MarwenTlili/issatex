import React from "react";
import { TextField, BooleanField, Show, SimpleShowLayout } from "react-admin";

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
        <TextField source="employe.ref" label="Employe" />
        <TextField source="employe.nom" label="Nom Emp" />
        <TextField source="employe.prenom" label="Prenom Emp" />
        <TextField source="employe.poste" label="Position" />
        <TextField source="ilot.ref" label="Ilot" />
        <BooleanField source="responsable" label="Is Responsible" />
      </SimpleShowLayout>
    </Show>
  );
};
