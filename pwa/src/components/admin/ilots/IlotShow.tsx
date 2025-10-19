"use client";

import type * as React from "react";
import {
  Show,
  SimpleShowLayout,
  TextField,
  ReferenceManyField,
  Datagrid,
  SimpleList,
  useRecordContext,
  BooleanField,
  DateField,
  FunctionField,
} from "react-admin";
import {
  Typography,
  Box,
  Grid,
  Chip,
  useMediaQuery,
  useTheme,
  Paper,
} from "@mui/material";
import {
  People,
  Hardware,
  DateRange,
  AccessTime,
  Info,
} from "@mui/icons-material";
import { formatDecimalHours } from "@/lib/utils/date";

// --- Section Title Component ---
const SectionTitle = ({ icon: Icon, title }: { icon: any; title: string }) => (
  <Box
    display="flex"
    alignItems="center"
    gap={1.5}
    mt={4}
    mb={2}
    sx={{
      borderBottom: "2px solid",
      borderColor: "primary.main",
      paddingBottom: 1,
    }}
  >
    <Icon sx={{ color: "primary.main", fontSize: 28 }} />
    <Typography
      variant="h6"
      fontWeight="700"
      sx={{
        fontSize: { xs: "1rem", sm: "1.25rem" },
        letterSpacing: 0.5,
      }}
    >
      {title}
    </Typography>
  </Box>
);

// --- Ilot Summary ---
const IlotSummary = () => {
  const record = useRecordContext();
  const theme = useTheme();

  if (!record) return null;

  return (
    <Paper
      elevation={0}
      sx={{
        mb: 4,
        p: { xs: 2, sm: 3 },
        background:
          "linear-gradient(135deg, var(--color-primary-light) 0%, var(--color-primary-lighter) 100%)",
        borderRadius: 2,
        border: "1px solid",
        borderColor: "divider",
      }}
    >
      <Grid container spacing={2} alignItems="flex-start">
        <Grid item xs={12} sm="auto">
          <Box
            sx={{
              width: { xs: 60, sm: 80 },
              height: { xs: 60, sm: 80 },
              borderRadius: "12px",
              background: "primary.main",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: { xs: "1.5rem", sm: "2rem" },
              fontWeight: "bold",
            }}
          >
            {record.nom?.charAt(0).toUpperCase()}
          </Box>
        </Grid>
        <Grid item xs={12} sm>
          <Typography
            variant="h5"
            sx={{
              fontWeight: "700",
              fontSize: { xs: "1.5rem", sm: "1.75rem" },
              mb: 0.5,
              color: "text.primary",
            }}
          >
            {record.nom}
          </Typography>
          <Box
            display="flex"
            gap={1}
            flexWrap="wrap"
            alignItems="center"
            mb={1}
          >
            <Chip
              icon={<Info sx={{ fontSize: 16 }} />}
              label={`Ref: ${record.ref ?? "—"}`}
              variant="outlined"
              size="small"
              sx={{
                fontWeight: 500,
                borderColor: "primary.main",
                color: "primary.main",
              }}
            />
          </Box>
          {record.description && (
            <Typography
              variant="body2"
              sx={{
                color: "text.secondary",
                lineHeight: 1.6,
                mt: 1,
              }}
            >
              {record.description}
            </Typography>
          )}
        </Grid>
      </Grid>
    </Paper>
  );
};

// --- Responsive Datagrid wrapper ---
const ResponsiveReferenceList = ({
  children,
  reference,
  target,
  sort,
  renderSimpleListItem,
}: {
  children: React.ReactNode;
  reference: string;
  target: string;
  sort?: { field: string; order: string };
  renderSimpleListItem: (record: any) => React.ReactNode;
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      sx={{
        overflowX: "auto",
        borderRadius: 1,
        border: "1px solid",
        borderColor: "divider",
        mb: 2,
      }}
    >
      <ReferenceManyField
        label=""
        reference={reference}
        target={target}
        sort={{ field: "id", order: "ASC" }}
      >
        {isMobile ? (
          <SimpleList primaryText={(record) => renderSimpleListItem(record)} />
        ) : (
          <Datagrid bulkActionButtons={false}>{children}</Datagrid>
        )}
      </ReferenceManyField>
    </Box>
  );
};

const CustomTitle = () => {
  const record = useRecordContext();
  return record ? <span>{record.ref}</span> : null;
};

// --- Main Show Component ---
export const IlotShow = () => {
  return (
    <Show title={<CustomTitle />}>
      <SimpleShowLayout>
        <IlotSummary />

        {/* Affectations */}
        <SectionTitle icon={People} title="Affectations (Employés assignés)" />
        <ResponsiveReferenceList
          reference="api/affectation_employe_ilots"
          target="ilot"
          sort={{ field: "id", order: "ASC" }}
          renderSimpleListItem={(r) =>
            `${r.employe?.nom ?? ""} ${r.employe?.prenom ?? ""} ${
              r.responsable ? "⭐ Responsable" : ""
            }`
          }
        >
          <TextField source="ref" label="ID" />
          <TextField source="employe.nom" label="Employé" />
          <TextField source="employe.prenom" label="Prénom" />
          <BooleanField source="responsable" label="Responsable" />
        </ResponsiveReferenceList>

        {/* Machines */}
        <SectionTitle icon={Hardware} title="Machines de cet ilot" />
        <ResponsiveReferenceList
          reference="api/machines"
          target="ilot"
          sort={{ field: "id", order: "ASC" }}
          renderSimpleListItem={(r) =>
            `${r.nom ?? ""} (${r.type ?? ""}) - Statut: ${r.statut ?? ""}`
          }
        >
          <TextField source="ref" label="Référence" />
          <TextField source="nom" label="Nom" />
          <TextField source="type" label="Type" />
          <TextField source="statut" label="Statut" />
        </ResponsiveReferenceList>

        {/* Plannings */}
        <SectionTitle icon={DateRange} title="Plannings de cet ilot" />
        <ResponsiveReferenceList
          reference="api/plannings"
          target="ilot"
          sort={{ field: "dateCreation", order: "DESC" }}
          renderSimpleListItem={(r) =>
            `${r.ref ?? ""} - ${r.dateDebut ?? ""} → ${r.dateFin ?? ""}`
          }
        >
          <TextField source="ref" label="Référence" />
          <DateField source="dateCreation" label="Créé le" />
          <DateField source="dateDebut" label="Début" />
          <DateField source="dateFin" label="Fin" />
        </ResponsiveReferenceList>

        {/* Presences */}
        <SectionTitle icon={AccessTime} title="Présences de cet ilot" />
        <ResponsiveReferenceList
          reference="api/presences"
          target="ilot"
          sort={{ field: "datePresence", order: "DESC" }}
          renderSimpleListItem={(r) =>
            `${r.employe?.nom ?? ""} (${r.ref ?? ""}) - ${formatDecimalHours(
              r.tempsPresence
            )}`
          }
        >
          <TextField source="ref" label="Référence" />
          <DateField source="datePresence" label="Date" />
          <FunctionField
            label="Employé"
            render={(r) =>
              `${r.employe?.nom ?? ""} ${r.employe?.prenom ?? ""} (${
                r.employe?.ref ?? ""
              })`
            }
          />
          <FunctionField
            label="Temps de présence"
            render={(r) => formatDecimalHours(r.tempsPresence)}
          />
        </ResponsiveReferenceList>
      </SimpleShowLayout>
    </Show>
  );
};
