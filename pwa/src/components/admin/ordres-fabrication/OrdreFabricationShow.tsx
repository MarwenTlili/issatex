"use client";

import React from "react";

import {
  Show,
  SimpleShowLayout,
  TextField,
  DateField,
  BooleanField,
  ReferenceField,
  ReferenceManyField,
  Datagrid,
  NumberField,
  FunctionField,
  useRecordContext,
  TopToolbar,
  ListButton,
  CreateButton,
  useRedirect,
} from "react-admin";
import {
  Card,
  CardContent,
  CardHeader,
  Grid,
  Typography,
  Box,
  Chip,
} from "@mui/material";
import {
  Schedule as ScheduleIcon,
  Assignment as AssignmentIcon,
  Straighten as StraightenIcon,
} from "@mui/icons-material";

const ShowActions = () => {
  return (
    <TopToolbar>
      <ListButton />
      <CreateButton
        resource="api/plannings"
        label="Créer Planning"
        icon={<ScheduleIcon />}
      />
    </TopToolbar>
  );
};

const StatutChip = () => {
  const record = useRecordContext();
  if (!record) return null;

  const getStatutColor = (statut: string) => {
    switch (statut) {
      case "CREE":
        return "default";
      case "EN_COURS":
        return "primary";
      case "TERMINE":
        return "success";
      case "ANNULE":
        return "error";
      case "EN_ATTENTE":
        return "warning";
      default:
        return "default";
    }
  };

  const getStatutLabel = (statut: string) => {
    switch (statut) {
      case "CREE":
        return "Créé";
      case "EN_COURS":
        return "En cours";
      case "TERMINE":
        return "Terminé";
      case "ANNULE":
        return "Annulé";
      case "EN_ATTENTE":
        return "En attente";
      default:
        return statut;
    }
  };

  return (
    <Chip
      label={getStatutLabel(record.statut)}
      color={getStatutColor(record.statut)}
      size="medium"
      variant="filled"
    />
  );
};

const OrderSummaryCard = () => {
  const record = useRecordContext();
  if (!record) return null;

  const totalValue =
    record.quantiteTotale * Number.parseFloat(record.prixUnitaire || 0);
  const totalTime = record.quantiteTotale * (record.tempsUnitaire / 100 || 0);

  return (
    <Card>
      <CardHeader
        title="Résumé de l'Ordre De Fabrication"
        avatar={<AssignmentIcon color="primary" />}
      />
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={6} md={2}>
            <Typography variant="body2" color="textSecondary">
              Quantité totale
            </Typography>
            <Typography variant="h6">
              {record.quantiteTotale?.toLocaleString()} pièces
            </Typography>
          </Grid>
          <Grid item xs={6} md={2}>
            <Typography variant="body2" color="textSecondary">
              Prix unitaire
            </Typography>
            <Typography variant="h6">
              {new Intl.NumberFormat("fr-FR", {
                style: "currency",
                currency: "EUR",
              }).format(Number.parseFloat(record.prixUnitaire || 0))}
            </Typography>
          </Grid>
          <Grid item xs={6} md={2}>
            <Typography variant="body2" color="textSecondary">
              Valeur totale
            </Typography>
            <Typography variant="h6" color="primary">
              {new Intl.NumberFormat("fr-FR", {
                style: "currency",
                currency: "EUR",
              }).format(totalValue)}
            </Typography>
          </Grid>
          <Grid item xs={6} md={3}>
            <Typography variant="body2" color="textSecondary">
              Temps Unitaire (cmn)
            </Typography>
            <Typography variant="h6" color="primary">
              {record.tempsUnitaire}
            </Typography>
          </Grid>
          <Grid item xs={6} md={3}>
            <Typography variant="body2" color="textSecondary">
              Temps total estimé (h)
            </Typography>
            <Typography variant="h6">
              {Math.round(totalTime / 60)} heures
            </Typography>
          </Grid>
        </Grid>

        <Box mt={2} display="flex" gap={1} flexWrap="wrap">
          {record.urgent && (
            <Chip label="URGENT" color="error" size="small" variant="filled" />
          )}
          {record.lance ? (
            <Chip
              label="EN PRODUCTION"
              color="success"
              size="small"
              variant="filled"
            />
          ) : (
            <Chip
              label="EN ATTENTE DE LANCEMENT"
              color="default"
              size="small"
              variant="outlined"
            />
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

const TailleOrdreFabricationDatagrid = () => {
  const ordreFabrication = useRecordContext();

  return (
    <Datagrid bulkActionButtons={false}>
      <TextField source="tailleArticle" label="Taille" />
      <NumberField source="quantite" label="Quantité" />
      <FunctionField
        label="Pourcentage"
        render={(tailleOF: any) => {
          const percent =
            ordreFabrication?.quantiteTotale > 0
              ? (
                  (tailleOF.quantite / ordreFabrication?.quantiteTotale) *
                  100
                ).toFixed(1)
              : "0.0";
          return `${percent}%`;
        }}
      />
      <FunctionField
        label="Valeur"
        render={(tailleOF: any) => {
          const prix = parseFloat(ordreFabrication?.prixUnitaire || "0");
          const value = tailleOF.quantite * prix;
          return new Intl.NumberFormat("fr-FR", {
            style: "currency",
            currency: "EUR",
          }).format(value);
        }}
      />
    </Datagrid>
  );
};

export const OrdreFabricationShow = () => (
  <Show actions={<ShowActions />}>
    <SimpleShowLayout>
      <Grid container spacing={3}>
        {/* Header Information */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={2}
              >
                <Typography variant="h5" component="h1">
                  Ordre de Fabrication #
                  {<TextField source="ref" component="span" />}
                </Typography>
                <StatutChip />
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" color="textSecondary">
                    Client
                  </Typography>
                  <ReferenceField
                    source="client"
                    reference="api/clients"
                    link="show"
                  >
                    <Typography variant="h6">
                      <TextField source="nom" />
                    </Typography>
                  </ReferenceField>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" color="textSecondary">
                    Article
                  </Typography>
                  <ReferenceField
                    source="article"
                    reference="api/articles"
                    link="show"
                  >
                    <Typography variant="h6">
                      <TextField source="designation" />
                    </Typography>
                  </ReferenceField>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" color="textSecondary">
                    Date de création
                  </Typography>
                  <Typography variant="body1">
                    <DateField source="dateCreation" />
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" color="textSecondary">
                    Date de clôture prévue
                  </Typography>
                  <Typography variant="body1">
                    <DateField source="dateCloture" />
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Summary Cards */}
        <Grid item xs={12} md={12}>
          <OrderSummaryCard />
        </Grid>

        {/* Tailles (Sizes) Section */}
        <Grid item xs={12}>
          <Card>
            <CardHeader
              title="Répartition par tailles"
              avatar={<StraightenIcon color="primary" />}
            />
            <CardContent>
              <ReferenceManyField
                label=""
                reference="api/taille_ordre_fabrications"
                target="ordreFabrication"
                sort={{ field: "tailleArticle", order: "ASC" }}
              >
                <ReferenceManyField
                  label=""
                  reference="api/taille_ordre_fabrications"
                  target="ordreFabrication"
                  sort={{ field: "tailleArticle", order: "ASC" }}
                >
                  <TailleOrdreFabricationDatagrid />
                </ReferenceManyField>
              </ReferenceManyField>
            </CardContent>
          </Card>
        </Grid>

        {/* Planning Section */}
        <Grid item xs={12}>
          <Card>
            <CardHeader
              title="Planification de production"
              avatar={<ScheduleIcon color="primary" />}
            />
            <CardContent>
              <ReferenceManyField
                label=""
                reference="api/plannings"
                target="ordreFabrication"
                sort={{ field: "dateDebut", order: "ASC" }}
              >
                <Datagrid rowClick="show" bulkActionButtons={false}>
                  <TextField source="ref" label="Référence Planning" />
                  <DateField source="dateDebut" label="Date début" />
                  <DateField source="dateFin" label="Date fin" />
                  <FunctionField
                    label="Durée"
                    render={(record: any) => {
                      if (!record.dateDebut || !record.dateFin) return "-";
                      const start = new Date(record.dateDebut);
                      const end = new Date(record.dateFin);
                      const diffTime = Math.abs(
                        end.getTime() - start.getTime()
                      );
                      const diffDays = Math.ceil(
                        diffTime / (1000 * 60 * 60 * 24)
                      );
                      return `${diffDays} jour${diffDays > 1 ? "s" : ""}`;
                    }}
                  />
                  <ReferenceField
                    source="ilot"
                    reference="api/ilots"
                    link="show"
                    label="Ilot"
                  >
                    <TextField source="nom" />
                  </ReferenceField>
                  <BooleanField source="reporte" label="Reporté" />
                </Datagrid>
              </ReferenceManyField>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </SimpleShowLayout>
  </Show>
);
