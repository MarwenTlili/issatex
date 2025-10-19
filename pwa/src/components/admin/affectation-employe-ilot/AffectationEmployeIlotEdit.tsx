import React from "react";

import {
  AutocompleteInput,
  BooleanInput,
  Edit,
  ReferenceInput,
  SimpleForm,
} from "react-admin";
import {
  filterEmployeByRef,
  filterIlotByRef,
} from "./AffectationEmployeIlotCreate";

export const AffectationEmployeIlotEdit = () => {
  return (
    <Edit
      redirect="list"
      transform={(data) => ({
        ...data,
        employe: data.employe?.["@id"] ?? null,
        ilot: data.ilot?.["@id"] ?? null,
      })}
    >
      <SimpleForm>
        {/* Employee Reference Input */}
        <ReferenceInput
          source="employe.@id"
          reference="api/employes"
          required
          perPage={25} // Only fetches 10 items at a time
          enableGetChoices={({ q }) => q && q.length >= 2} // Requires 2 characters to start searching
        >
          <AutocompleteInput
            label="Employee"
            optionValue="@id"
            // Keep your informative optionText function
            optionText={(record) =>
              `${record.ref} - ${record.nom} ${record.prenom}`
            }
            filterToQuery={filterEmployeByRef}
          />
        </ReferenceInput>

        {/* Ilot Reference Input */}
        <ReferenceInput
          source="ilot.@id"
          reference="api/ilots"
          required
          perPage={25}
          enableGetChoices={({ q }) => q && q.length >= 2}
        >
          <AutocompleteInput
            label="Ilot"
            optionValue="@id"
            optionText={(record) => `${record.ref} - ${record.nom}`}
            filterToQuery={filterIlotByRef}
          />
        </ReferenceInput>

        <BooleanInput source="responsable" label="Is Responsible" />
      </SimpleForm>
    </Edit>
  );
};
