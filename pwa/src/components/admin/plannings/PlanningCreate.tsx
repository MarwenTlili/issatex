import React, { useEffect } from "react";
import {
  BooleanInput,
  Create,
  DateInput,
  ReferenceInput,
  SelectInput,
  SimpleForm,
} from "react-admin";
import { useWatch } from "react-hook-form";

const getNextMonday = () => {
  const today = new Date();
  const day = today.getDay(); // 0 (Sun) to 6 (Sat)
  const diff = (8 - day) % 7 || 7; // Days until next Monday
  const nextMonday = new Date(today);
  nextMonday.setDate(today.getDate() + diff);
  return nextMonday;
};

const addDays = (date: Date, days: number) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

const WatchPlanning = () => {
  const dateDebutWatch = useWatch({ name: "dateDebut" });
  const dateFinWatch = useWatch({ name: "dateFin" });

  useEffect(() => {
    console.log("dateDebutWatch:", dateDebutWatch);
    console.log("dateFinWatch:", dateFinWatch);
  }, [dateDebutWatch, dateFinWatch]);

  return <></>;
};

const PlanningCreate = () => {
  const dateDebut = getNextMonday();
  const dateFin = addDays(dateDebut, 6);

  return (
    <Create
      transform={(data) => ({
        ...data,
        // dateCreation: new Date().toISOString(),
        dateDebut: new Date(data.dateDebut).toISOString(),
        dateFin: new Date(data.dateFin).toISOString(),
      })}
    >
      <SimpleForm>
        {/* <WatchPlanning /> */}

        <DateInput source="dateCreation" defaultValue={new Date()} />
        <DateInput source="dateDebut" defaultValue={dateDebut.toISOString()} />
        <DateInput source="dateFin" defaultValue={dateFin.toISOString()} />
        <BooleanInput source="reporte" />

        <ReferenceInput
          source="ordreFabrication"
          reference="api/ordre_fabrications"
        >
          <SelectInput
            optionText={(record) =>
              `${record.ref} - ${new Date(
                record.dateCreation
              ).toLocaleDateString()}`
            }
          />
        </ReferenceInput>

        <ReferenceInput source="ilot" reference="api/ilots">
          <SelectInput
            optionText={(record) => `${record.ref} - ${record.nom}`}
          />
        </ReferenceInput>
      </SimpleForm>
    </Create>
  );
};

export default PlanningCreate;
