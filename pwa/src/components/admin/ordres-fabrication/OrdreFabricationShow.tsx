"use client";

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
  Button,
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
  Alert,
  LinearProgress,
} from "@mui/material";
import {
  Schedule as ScheduleIcon,
  Assignment as AssignmentIcon,
  Straighten as StraightenIcon,
  PlayArrow as PlayArrowIcon,
} from "@mui/icons-material";

const ShowActions = () => {
  const redirect = useRedirect();

  return (
    <TopToolbar>
      <ListButton />
      <CreateButton
        resource="plannings"
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
  const totalTime = record.quantiteTotale * (record.tempsUnitaire || 0);

  return (
    <Card>
      <CardHeader
        title="Résumé de l'Ordre De Fabrication"
        avatar={<AssignmentIcon color="primary" />}
      />
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={6} md={3}>
            <Typography variant="body2" color="textSecondary">
              Quantité totale
            </Typography>
            <Typography variant="h6">
              {record.quantiteTotale?.toLocaleString()} pièces
            </Typography>
          </Grid>
          <Grid item xs={6} md={3}>
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
          <Grid item xs={6} md={3}>
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
              Temps total estimé
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

const ProductionProgressCard = () => {
  const record = useRecordContext();
  if (!record) return null;

  // This would need to be calculated from actual production data
  const progress =
    record.statut === "TERMINE" ? 100 : record.statut === "EN_COURS" ? 45 : 0;

  return (
    <Card>
      <CardHeader
        title="Avancement de la production"
        avatar={<PlayArrowIcon color="primary" />}
      />
      <CardContent>
        <Box mb={2}>
          <Typography variant="body2" color="textSecondary" gutterBottom>
            Progression globale
          </Typography>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{ height: 8, borderRadius: 4 }}
          />
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            {progress}% complété
          </Typography>
        </Box>

        {record.statut === "ANNULE" && (
          <Alert severity="error" sx={{ mt: 2 }}>
            Cette commande a été annulée
          </Alert>
        )}

        {record.urgent && record.statut !== "TERMINE" && (
          <Alert severity="warning" sx={{ mt: 2 }}>
            Commande urgente - Priorité élevée
          </Alert>
        )}
      </CardContent>
    </Card>
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
        <Grid item xs={12} md={8}>
          <OrderSummaryCard />
        </Grid>
        <Grid item xs={12} md={4}>
          <ProductionProgressCard />
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
                <Datagrid bulkActionButtons={false}>
                  <TextField source="tailleArticle" label="Taille" />
                  <NumberField source="quantite" label="Quantité" />
                  <FunctionField
                    label="Pourcentage"
                    render={(record: any, parentRecord: any) => {
                      const percentage = parentRecord
                        ? (
                            (record.quantite / parentRecord.quantiteTotale) *
                            100
                          ).toFixed(1)
                        : 0;
                      return `${percentage}%`;
                    }}
                  />
                  <FunctionField
                    label="Valeur"
                    render={(record: any, parentRecord: any) => {
                      const value = parentRecord
                        ? record.quantite *
                          Number.parseFloat(parentRecord.prixUnitaire || 0)
                        : 0;
                      return new Intl.NumberFormat("fr-FR", {
                        style: "currency",
                        currency: "EUR",
                      }).format(value);
                    }}
                  />
                </Datagrid>
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

              {/* Add Planning Button */}
              <Box mt={2}>
                <Button
                  variant="contained"
                  startIcon={<ScheduleIcon />}
                  onClick={() =>
                    (window.location.href = "/admin/plannings/create")
                  }
                >
                  Ajouter un planning
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </SimpleShowLayout>
  </Show>
);
