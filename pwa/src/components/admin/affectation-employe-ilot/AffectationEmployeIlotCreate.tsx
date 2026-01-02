import React from "react";

import {
  AutocompleteInput,
  BooleanInput,
  Create,
  ReferenceInput,
  required,
  SimpleForm,
  useDataProvider,
  useNotify,
  useRedirect,
  useResourceContext,
} from "react-admin";

export const filterEmployeByRef = (searchText: string) => ({
  ref: searchText,
});

export const filterIlotByRef = (searchText: string) => ({
  ref: searchText,
});

export const AffectationEmployeIlotCreate = () => {
  const dataProvider = useDataProvider();
  const notify = useNotify();
  const redirect = useRedirect();
  const resource = useResourceContext();

  const handleSubmit = async (data: any) => {
    const payload = {
      ...data,
      employe: data.employe?.["@id"] ?? null,
      ilot: data.ilot?.["@id"] ?? null,
    };

    try {
      await dataProvider.create("api/affectation_employe_ilots", {
        data: payload,
      });
      notify("✅ Creation réussie", { type: "success" });
      redirect("list", resource);
    } catch (error: any) {
      if (error.body?.violations) {
        // Map violations to React Admin field error shape
        const fieldErrors = error.body.violations.reduce(
          (acc: Record<string, string>, v: any) => {
            // Map backend propertyPath to the actual React Admin field
            let path = v.propertyPath;

            if (path === "employe") path = "employe.@id";
            if (path === "ilot") path = "ilot.@id";
            acc[path] = v.message;
            return acc;
          },
          {}
        );

        notify("⚠️ Erreur de validation", { type: "warning" });
        return fieldErrors; // makes <SimpleForm> highlight fields
      }

      notify("❌ Erreur inattendue", { type: "error" });
    }
  };

  return (
    <Create
      redirect="list"
      transform={(data) => ({
        // transformation logic is correct for Hydra/JSON-LD "@id" references
        ...data,
        employe: data.employe?.["@id"] ?? null,
        ilot: data.ilot?.["@id"] ?? null,
      })}
    >
      <SimpleForm onSubmit={handleSubmit}>
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
            validate={required()}
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
            validate={required()}
          />
        </ReferenceInput>

        <BooleanInput source="responsable" label="Is Responsible" />
      </SimpleForm>
    </Create>
  );
};
