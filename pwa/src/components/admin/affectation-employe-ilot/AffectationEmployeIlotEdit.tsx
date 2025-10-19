import React from "react";
import {
  BooleanInput,
  Edit,
  ReferenceInput,
  SelectInput,
  SimpleForm,
} from "react-admin";

export const AffectationEmployeIlotEdit = () => {
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
        <ReferenceInput source="employe.@id" reference="api/employes" required>
          <SelectInput
            label="Employee"
            optionValue="@id"
            optionText={(record) =>
              `${record.ref} - ${record.nom} ${record.prenom}`
            }
          />
        </ReferenceInput>
        <ReferenceInput source="ilot.@id" reference="api/ilots" required>
          <SelectInput
            label="Ilot"
            optionValue="@id"
            optionText={(record) => `${record.ref} - ${record.nom}`}
          />
        </ReferenceInput>
        <BooleanInput source="responsable" label="Is Responsible" />
      </SimpleForm>
    </Edit>
  );
};
