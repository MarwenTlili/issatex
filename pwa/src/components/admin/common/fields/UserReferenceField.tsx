import { ChipField, ReferenceField } from "react-admin";

export const UserReferenceField = (props: any) => {
  return (
    <ReferenceField source="account" reference="api/users" {...props}>
      <ChipField source="username" />
    </ReferenceField>
  );
};
