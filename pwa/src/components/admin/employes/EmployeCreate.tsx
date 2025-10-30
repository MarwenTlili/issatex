import React from "react";
import {
  Create,
  SimpleForm,
  TextInput,
} from "react-admin";

export const EmployeCreate = () => {
  return (
    <Create redirect="list">
      <SimpleForm>
        <TextInput source="nom" label="Nom" required />
        <TextInput source="prenom" label="Prenom" required />
        <TextInput source="poste" label="Poste" required />
      </SimpleForm>
    </Create>
  );
};
