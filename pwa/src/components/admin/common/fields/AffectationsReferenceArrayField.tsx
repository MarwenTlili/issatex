import React from "react";
import { ReferenceArrayField, SingleFieldList, TextField } from "react-admin";
import { AffectationEmployeIlot } from "@/types/resources/AffectationEmployeIlot";

export const AffectationsReferenceArrayField = (props: any) => (
  <ReferenceArrayField<AffectationEmployeIlot>
    source="affectations"
    reference="api/affectation_employe_ilots"
    {...props}
  >
    <SingleFieldList linkType="show">
      <TextField source="ilot.ref" />
    </SingleFieldList>
  </ReferenceArrayField>
);
