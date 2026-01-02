import { Box, CircularProgress } from "@mui/material";
import React from "react";
import {
  Edit,
  SimpleForm,
  ReferenceInput,
  AutocompleteInput,
  BooleanInput,
  useDataProvider,
  useNotify,
  useRedirect,
  useRecordContext,
  required,
  useResourceContext,
} from "react-admin";
import {
  filterEmployeByRef,
  filterIlotByRef,
} from "./AffectationEmployeIlotCreate";

const AffectationEmployeIlotForm = () => {
  const dataProvider = useDataProvider();
  const notify = useNotify();
  const redirect = useRedirect();
  const resource = useResourceContext();
  const record = useRecordContext(); // ✅ get the current record safely

  if (!record)
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%", // or '80vh' / 'calc(100vh - 64px)' depending on layout
        }}
      >
        <CircularProgress />
      </Box>
    );

  const handleSubmit = async (data: any) => {
    if (!record) return;

    const payload = {
      ...data,
      employe: data.employe?.["@id"] ?? null,
      ilot: data.ilot?.["@id"] ?? null,
    };

    try {
      await dataProvider.update("api/affectation_employe_ilots", {
        id: record.id,
        previousData: record,
        data: payload,
      });

      notify("✅ Mise à jour réussie", { type: "success" });
      redirect("list", resource);
      return Promise.resolve();
    } catch (error: any) {
      if (error.body?.violations) {
        const fieldErrors = error.body.violations.reduce(
          (acc: Record<string, string>, v: any) => {
            let path = v.propertyPath;
            if (path === "employe") path = "employe.@id";
            if (path === "ilot") path = "ilot.@id";
            acc[path] = v.message;
            return acc;
          },
          {}
        );

        notify("⚠️ Erreur de validation", { type: "warning" });
        return fieldErrors;
      }

      notify("❌ Erreur inattendue", { type: "error" });
      return Promise.reject(error);
    }
  };

  return (
    <SimpleForm onSubmit={handleSubmit}>
      <ReferenceInput source="employe.@id" reference="api/employes" required>
        <AutocompleteInput
          label="Employee"
          optionValue="@id"
          optionText={(record) =>
            `${record.ref} - ${record.nom} ${record.prenom}`
          }
          filterToQuery={filterEmployeByRef}
          validate={required()}
        />
      </ReferenceInput>

      <ReferenceInput source="ilot.@id" reference="api/ilots" required>
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
  );
};

export const AffectationEmployeIlotEdit = () => {
  return (
    <Edit>
      <AffectationEmployeIlotForm />
    </Edit>
  );
};
