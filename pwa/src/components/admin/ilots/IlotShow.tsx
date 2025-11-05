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
  DateField,
  FunctionField,
  ReferenceArrayField,
  Link,
  ChipField,
  WithListContext,
} from "react-admin";
import {
  Typography,
  Box,
  Grid,
  Chip,
  useMediaQuery,
  Paper,
  Theme,
} from "@mui/material";
import {
  People,
  Hardware,
  DateRange,
  AccessTime,
  Info,
} from "@mui/icons-material";
import { formatDate } from "@/lib/utils/date";
import { Planning } from "@/types/resources/Planning";
import { AffectationEmployeIlot } from "@/types/resources/AffectationEmployeIlot";

// --- Section Title Component ---
const TitleSection = ({ icon: Icon, title }: { icon: any; title: string }) => (
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

const ResponsivePresences = () => {
  const isSmall = useMediaQuery((theme: Theme) => theme.breakpoints.down("sm"));

  return (
    <ReferenceManyField reference="api/presences" target="ilot">
      {isSmall ? (
        <SimpleList
          primaryText={(record) => record.ref}
          secondaryText={(record) =>
            `${record.employe?.nom ?? ""} ${record.employe?.prenom ?? ""}`
          }
          tertiaryText={(record) =>
            `${formatDate(record.datePresence)} — ${record.statut}`
          }
          rowClick="show"
        />
      ) : (
        <Datagrid bulkActionButtons={false}>
          <TextField source="ref" />
          <DateField source="datePresence" />
          <FunctionField
            label="Employé"
            render={(record) =>
              `${record.employe?.nom ?? ""} ${record.employe?.prenom ?? ""}`
            }
          />
          <TextField source="statut" />
        </Datagrid>
      )}
    </ReferenceManyField>
  );
};

const ResponsiveMachines = () => (
  <ReferenceArrayField
    label="Machines"
    reference="api/machines"
    source="machines"
  >
    <WithListContext
      render={({ data }) => (
        <Grid container spacing={2}>
          {data?.map((machine) => (
            <Grid key={machine.id} item xs={6} sm={3} md={2}>
              <Link to={`/api/machines/${encodeURIComponent(machine.id)}/show`}>
                <ChipField record={machine} source="ref" />
              </Link>
            </Grid>
          ))}
        </Grid>
      )}
    />
  </ReferenceArrayField>
);

const ResponsableChip = ({ isResponsable }: { isResponsable: boolean }) => {
  if (!isResponsable) return null;
  return <Chip label="Responsable" sx={{ fontWeight: 500, fontSize: 12 }} />;
};

const ResponsiveAffectations = () => {
  const isSmall = useMediaQuery((theme: Theme) => theme.breakpoints.down("sm"));

  return (
    <ReferenceManyField reference="api/affectation_employe_ilots" target="ilot">
      {isSmall ? (
        <SimpleList<AffectationEmployeIlot>
          primaryText={(record) => record.ref}
          secondaryText={(record) =>
            `${record.employe.nom} ${record.employe.prenom}`
          }
          tertiaryText={(record) => (
            <ResponsableChip isResponsable={record.responsable} />
          )}
          rowClick="show"
        />
      ) : (
        <Datagrid bulkActionButtons={false}>
          <TextField source="ref" />
          <FunctionField<AffectationEmployeIlot>
            label="Employe"
            render={(record) =>
              `${record.employe.nom} ${record.employe.prenom}`
            }
          />
          {/* <BooleanField source="responsable" /> */}
          <FunctionField<AffectationEmployeIlot>
            label="Responsable"
            render={(record) => (
              <ResponsableChip isResponsable={record.responsable} />
            )}
          />
        </Datagrid>
      )}
    </ReferenceManyField>
  );
};

const ResponsivePlannings = () => {
  const isSmall = useMediaQuery((theme: Theme) => theme.breakpoints.down("sm"));

  return (
    <ReferenceManyField reference="api/plannings" target="ilot">
      {isSmall ? (
        <SimpleList<Planning>
          primaryText={(record) => record.ref}
          secondaryText={(record) =>
            `de: ${formatDate(record.dateDebut)} à ${formatDate(
              record.dateFin
            )}`
          }
          tertiaryText={(record) => formatDate(record.dateCreation)}
          rowClick="show"
        />
      ) : (
        <Datagrid bulkActionButtons={false}>
          <TextField source="ref" />
          <DateField source="dateCreation" />
          <DateField source="dateDebut" />
          <DateField source="dateFin" />
        </Datagrid>
      )}
    </ReferenceManyField>
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

        {/* Machines */}
        <TitleSection icon={Hardware} title="Machines dans cet ilot" />
        <ResponsiveMachines />

        <TitleSection
          icon={People}
          title="(Affectation) - Employes dans cet ilot"
        />
        <ResponsiveAffectations />

        {/* Plannings */}
        <TitleSection icon={DateRange} title="Plannings dans cet ilot" />
        <ResponsivePlannings />

        {/* Presences */}
        <TitleSection icon={AccessTime} title="Présences de cet ilot" />
        <ResponsivePresences />
      </SimpleShowLayout>
    </Show>
  );
};
