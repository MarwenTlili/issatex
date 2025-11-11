"use client";

import type * as React from "react";
import { Show, SimpleShowLayout, useRecordContext } from "react-admin";
import {
  Typography,
  Box,
  Grid,
  Chip,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import { Info, ExpandMore } from "@mui/icons-material";
import { MachinesReferenceArrayField } from "@/components/admin/common/fields/MachinesReferenceArrayField";
import { AffectationsReferenceArrayField } from "@/components/admin/common/fields/AffectationsReferenceArrayField";
import { PresencesReferenceArrayField } from "@/components/admin/common/fields/PresencesReferenceArrayField";
import { PlanningsReferenceArrayField } from "@/components/admin/common/fields/PlanningsReferenceArrayField";

// --- Ilot Summary ---
const IlotSummary = (props: any) => {
  const record = useRecordContext();

  if (!record) return null;

  return (
    <Paper
      sx={{
        p: 2,
        borderRadius: 2,
        border: "1px solid",
        borderColor: "divider",
      }}
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
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
          {record.description ? (
            <Grid item xs={12}>
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
            </Grid>
          ) : null}
        </Grid>
      </Grid>
    </Paper>
  );
};

const CustomTitle = () => {
  const record = useRecordContext();
  return record ? <span>{record.ref}</span> : null;
};

export const IlotShow = () => {
  return (
    <Show title={<CustomTitle />}>
      <SimpleShowLayout>
        {/* Résumé */}
        <IlotSummary />

        {/* Machines */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography>Machines dans cet ilot</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <MachinesReferenceArrayField showIlot={false} />
          </AccordionDetails>
        </Accordion>

        {/* Affectation Employe Ilot */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography>(Affectation) - Employes dans cet ilot</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <AffectationsReferenceArrayField showIlot={false} />
          </AccordionDetails>
        </Accordion>

        {/* Plannings */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography>Plannings de production</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <PlanningsReferenceArrayField />
          </AccordionDetails>
        </Accordion>

        {/* Presences */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography>Présences de cet ilot</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <PresencesReferenceArrayField showIlot={false} />
          </AccordionDetails>
        </Accordion>
      </SimpleShowLayout>
    </Show>
  );
};
