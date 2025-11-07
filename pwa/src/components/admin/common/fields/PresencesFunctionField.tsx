import React from "react";
import { FunctionField } from "react-admin";
import { Employe } from "@/types/resources/Employe";

export const PresencesFunctionField = (props: any) => (
  <FunctionField<Employe>
    render={(record) => record.presences?.length ?? 0}
    {...props}
  />
);
