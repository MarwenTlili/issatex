import React from "react";
import {
  BooleanInput,
  Create,
  ReferenceInput,
  SelectInput,
  SimpleForm,
} from "react-admin";

export const AffectationEmployeIlotCreate = () => {
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
        <ReferenceInput source="employe" reference="api/employes" required>
          <SelectInput
            optionText={(record) =>
              `${record.nom} ${record.prenom} (${record.poste})`
            }
            label="Employee"
          />
        </ReferenceInput>
        <ReferenceInput source="ilot" reference="api/ilots" required>
          <SelectInput optionText="nom" label="Workshop" />
        </ReferenceInput>
        <BooleanInput source="responsable" label="Is Responsible" />
      </SimpleForm>
    </Create>
  );
};
