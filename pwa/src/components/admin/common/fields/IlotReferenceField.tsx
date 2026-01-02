import React from "react";
import { ReferenceField, ReferenceFieldProps, TextField } from "react-admin";

export const IlotReferenceField = (props: any) => (
  <ReferenceField source="ilot" reference="api/ilots" {...props}>
    <TextField source="nom" />
  </ReferenceField>
);
