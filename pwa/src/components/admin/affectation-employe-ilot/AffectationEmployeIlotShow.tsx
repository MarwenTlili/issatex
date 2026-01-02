import React from "react";
import { TextField, Show, SimpleShowLayout } from "react-admin";
import { EmployeFunctionField } from "@/components/admin/common/fields/EmployeFunctionField";
import { IlotFunctionField } from "@/components/admin/common/fields/IlotFunctionField";
import { ResponsableFunctionField } from "@/components/admin/common/fields/ResponsableFunctionField";

export const AffectationEmployeIlotShow = () => {
  return (
    <Show>
      <SimpleShowLayout
        sx={{
          "& .RaSimpleShowLayout-card": {
            backgroundColor: "var(--color-card)",
          },
        }}
      >
        <TextField source="ref" label="Reference" />
        <TextField source="employe.ref" label="Employe" />
        <EmployeFunctionField label="Employe" />
        <IlotFunctionField label="Ilot" />
        <ResponsableFunctionField label="Responsable?" />
      </SimpleShowLayout>
    </Show>
  );
};
