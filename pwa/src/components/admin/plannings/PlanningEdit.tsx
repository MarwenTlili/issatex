import React from "react";
import {
  BooleanInput,
  DateInput,
  Edit,
  ReferenceInput,
  SelectInput,
  SimpleForm,
} from "react-admin";

const PlanningEdit = () => {
  return (
    <Edit>
      <SimpleForm>
        <DateInput source="dateDebut" />
        <DateInput source="dateFin" />
        <BooleanInput source="reporte" />
        <ReferenceInput
          source="ordreFabrication"
          reference="api/ordre_fabrications"
        >
          <SelectInput optionText="ref" />
        </ReferenceInput>
        <ReferenceInput source="ilot" reference="api/ilots">
          <SelectInput optionText="nom" />
        </ReferenceInput>
      </SimpleForm>
    </Edit>
  );
};

export default PlanningEdit;
