import { Employe } from "@/types/resources/Employe";
import React from "react";
import { Edit, SimpleForm, TextInput, useRecordContext } from "react-admin";

const CustomTitle = () => {
  const record = useRecordContext<Employe>();
  return `${record?.ref}`;
};

export const EmployeEdit = () => {
  return (
    <Edit title={<CustomTitle />} redirect="list">
      <SimpleForm>
        <TextInput source="ref" disabled />
        <TextInput source="nom" label="Last Name" required />
        <TextInput source="prenom" label="First Name" required />
        <TextInput source="poste" label="Position" required />
      </SimpleForm>
    </Edit>
  );
};
