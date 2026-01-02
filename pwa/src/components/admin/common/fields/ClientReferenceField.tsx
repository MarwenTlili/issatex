import { ReferenceField, TextField } from "react-admin";

export const ClientReferenceField = (props: any) => (
  <ReferenceField
    reference="api/clients"
    source="client"
    link="show"
    {...props}
  >
    <TextField source="nom" />
  </ReferenceField>
);
