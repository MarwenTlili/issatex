import React from "react";
import {
  Create,
  SimpleForm,
  TextInput,
} from "react-admin";

export const EmployeCreate = () => {
  return (
    <Create>
      <SimpleForm
        sx={{
          "& .RaSimpleForm-form": {
            backgroundColor: "var(--color-card)",
            padding: "24px",
            borderRadius: "8px",
          },
        }}
      >
        <TextInput source="nom" label="Nom" required />
        <TextInput source="prenom" label="Prenom" required />
        <TextInput source="poste" label="Poste" required />
      </SimpleForm>
    </Create>
  );
};
