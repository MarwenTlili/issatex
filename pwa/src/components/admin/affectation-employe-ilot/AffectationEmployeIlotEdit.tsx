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
    </Edit>
  );
};
