import {
  Show,
  SimpleShowLayout,
  TextField,
  DateField,
  BooleanField,
  ReferenceManyField,
  Datagrid,
  NumberField,
  FunctionField,
  Link,
  useRecordContext,
  SimpleList,
} from "react-admin";
import { Box, Theme, useMediaQuery } from "@mui/material";
import { Planning } from "@/types/resources/Planning";
import { OrdreFabricationStatutChip } from "../common/OrdreFabricationStatutChip";

const CustomTitle = () => {
  const record = useRecordContext<Planning>();
  return `${record?.ref}`;
};

export const PlanningShow = () => {
  const isSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.down("sm"));

  return (
    <Show title={<CustomTitle />}>
      <SimpleShowLayout>
        <TextField source="ref" />
        <DateField source="dateCreation" />
        <DateField source="dateDebut" />
        <DateField source="dateFin" />
        <FunctionField<Planning>
          label="Ordre de fabrication"
          render={(record) => (
            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
              <Link
                to={`/api/ordre_fabrications/${encodeURIComponent(
                  record.ordreFabrication["@id"]
                )}/show`}
                sx={{ whiteSpace: "nowrap", overflow: "hidden" }}
              >
                {record.ordreFabrication.ref}
              </Link>
              <OrdreFabricationStatutChip
                record={record.ordreFabrication}
                props={{
                  variant: "outlined",
                }}
              />
            </Box>
          )}
        />
        <FunctionField<Planning>
          label="Ilot"
          render={(record) => (
            <Link
              to={`/api/ilots/${encodeURIComponent(record.ilot["@id"])}/show`}
            >
              {record.ilot.nom}
            </Link>
          )}
        />
        <BooleanField source="reporte" label="reporté" />

        <ReferenceManyField
          label="Productions"
          reference="api/productions"
          target="planning"
        >
          {isSmall ? (
            <SimpleList
              primaryText={(record) =>
                `${record.tailleArticle} - ${record.quantiteTotale} unités`
              }
              secondaryText={(record) =>
                `1er choix: ${record.quantitePremiereChoix}, 2e choix: ${record.quantiteDeuxiemeChoix}`
              }
              tertiaryText={(record) =>
                `Date: ${new Date(record.dateProduction).toLocaleDateString()}`
              }
            />
          ) : (
            <Datagrid rowClick="show" bulkActionButtons={false}>
              <DateField source="dateProduction" />
              <TextField source="tailleArticle" />
              <NumberField source="quantitePremiereChoix" />
              <NumberField source="quantiteDeuxiemeChoix" />
              <NumberField source="quantiteTotale" />
            </Datagrid>
          )}
        </ReferenceManyField>
        {/* Ajouter le champ "reporte" */}
      </SimpleShowLayout>
    </Show>
  );
};
