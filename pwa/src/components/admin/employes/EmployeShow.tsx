import { Employe } from "@/types/resources/Employe";
import {
  Show,
  SimpleShowLayout,
  TextField,
  ReferenceManyField,
  Datagrid,
  ReferenceField,
  BooleanField,
  DateField,
  useRecordContext,
  ReferenceArrayField,
  SimpleList,
} from "react-admin";
import { useMediaQuery, Theme } from "@mui/material";
import { formatDate } from "@/lib/utils/date";

const CustomTitle = () => {
  const record = useRecordContext<Employe>();
  return `${record?.ref || ""}`;
};

export const EmployeShow = () => {
  const isSmall = useMediaQuery((theme: Theme) => theme.breakpoints.down("sm"));

  return (
    <Show title={<CustomTitle />}>
      <SimpleShowLayout>
        <TextField source="ref" label="Reference" />
        <TextField source="nom" label="Nom" />
        <TextField source="prenom" label="Prénom" />
        <TextField source="poste" label="Poste" />

        {/* Affectations */}
        <ReferenceArrayField
          label="Affectation E/I"
          source="affectations"
          reference="api/affectation_employe_ilots"
        >
          {isSmall ? (
            <SimpleList
              primaryText={(record) => record.ref}
              secondaryText={(record) =>
                record.responsable ? "Responsable" : "Employé"
              }
              tertiaryText={(record) =>
                record["ilot"]?.nom ? `Ilot: ${record["ilot"].nom}` : ""
              }
            />
          ) : (
            <Datagrid bulkActionButtons={false}>
              <TextField source="ref" label="Référence AIE" />
              <ReferenceField
                source="ilot[@id]"
                reference="api/ilots"
                label="Ilot"
              >
                <TextField source="nom" />
              </ReferenceField>
              <BooleanField source="responsable" label="Responsable" />
            </Datagrid>
          )}
        </ReferenceArrayField>

        {/* Présences */}
        <ReferenceManyField
          label="Présence"
          reference="api/presences"
          target="employe"
          sort={{ field: "datePresence", order: "DESC" }}
        >
          {isSmall ? (
            <SimpleList
              primaryText={(record) => record.ref}
              secondaryText={(record) =>
                `Status: ${record.statut} - Temps: ${record.tempsPresence}`
              }
              tertiaryText={(record) =>
                `Date: ${formatDate(record.datePresence)}`
              }
            />
          ) : (
            <Datagrid rowClick={false}>
              <TextField source="ref" label="Référence" />
              <DateField source="datePresence" label="Date" />
              <TextField source="statut" label="Status" />
              <TextField source="tempsPresence" label="Temps de présence" />
              <ReferenceField
                source="ilot[@id]"
                reference="/api/ilots"
                link="show"
                label="Ilot"
              >
                <TextField source="nom" />
              </ReferenceField>
            </Datagrid>
          )}
        </ReferenceManyField>
      </SimpleShowLayout>
    </Show>
  );
};
