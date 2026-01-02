import React from "react";
import { AffectationEmployeIlot } from "@/types/resources/AffectationEmployeIlot";
import { FunctionField, Link } from "react-admin";

export const IlotFunctionField = (props: any) => (
  <FunctionField<AffectationEmployeIlot>
    source="employe"
    render={(record) => (
      <Link to={`/api/ilots/${encodeURIComponent(record.ilot["@id"])}/show`}>
        {record.ilot.nom}
      </Link>
    )}
    {...props}
  />
);
