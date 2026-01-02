import { Ilot } from "@/types/resources/Ilot";
import { OrdreFabrication } from "@/types/resources/OrdreFabrication";
import { Planning } from "@/types/resources/Planning";
import React from "react";
import {
  BooleanInput,
  DateInput,
  Edit,
  ReferenceInput,
  SelectInput,
  SimpleForm,
  useRecordContext,
} from "react-admin";

const CustomTitle = () => {
  const record = useRecordContext<OrdreFabrication>();
  return `${record?.ref}`;
};

const PlanningEdit = () => {
  const transform = (data: Planning, options?: { previousData: Planning }) => ({
    ...data,
    ordreFabrication: data.ordreFabrication["@id"],
    ilot: data.ilot["@id"],
  });

  return (
    <Edit<Planning> title={<CustomTitle />} transform={transform}>
      <SimpleForm>
        <DateInput source="dateDebut" />
        <DateInput source="dateFin" />
        <ReferenceInput
          source="ordreFabrication.@id"
          reference="api/ordre_fabrications"
        >
          <SelectInput
            label="Ordre Fabrication"
            optionValue="@id"
            optionText={(record) =>
              `${record.ref} - ${new Date(
                record.dateCreation
              ).toLocaleDateString()}`
            }
          />
        </ReferenceInput>
        <ReferenceInput source="ilot.@id" reference="api/ilots">
          <SelectInput
            label="Ilot"
            optionValue="@id"
            optionText={(record: Ilot) => `${record.ref} - ${record.nom}`}
          />
        </ReferenceInput>
        <BooleanInput source="reporte" />
      </SimpleForm>
    </Edit>
  );
};

export default PlanningEdit;
