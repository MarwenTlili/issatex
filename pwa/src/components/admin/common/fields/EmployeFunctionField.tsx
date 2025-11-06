import React from "react";
import { FunctionField, Link } from "react-admin";
import { AffectationEmployeIlot } from "@/types/resources/AffectationEmployeIlot";

export const EmployeFunctionField = (props: any) => (
  <FunctionField<AffectationEmployeIlot>
    source="employe"
    render={(record) => (
      <Link
        to={`/api/employes/${encodeURIComponent(record.employe["@id"])}/show`}
      >
        {record.employe.nom} {record.employe.prenom} - {record.employe.poste}
      </Link>
    )}
    {...props}
  />
);
