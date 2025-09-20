import React from "react";
import { Edit, SimpleForm, TextInput } from "react-admin";

export const EmployeEdit = () => {
  return (
    <Edit>
      <SimpleForm
        sx={{
          "& .RaSimpleForm-form": {
            backgroundColor: "var(--color-card)",
            padding: "24px",
            borderRadius: "8px",
          },
        }}
      >
        <TextInput source="nom" label="Last Name" required />
        <TextInput source="prenom" label="First Name" required />
        <TextInput source="poste" label="Position" required />
      </SimpleForm>
    </Edit>
  );
};
