import {
  List,
  Datagrid,
  TextField,
  DateField,
  ReferenceInput,
  AutocompleteInput,
  DateInput,
  BooleanInput,
  SelectInput,
  NumberField,
  TopToolbar,
  ExportButton,
  FilterButton,
  useRecordContext,
  SearchInput,
  FunctionField,
  FieldProps,
  useListContext,
  Link,
} from "react-admin";
import {
  Chip,
  Box,
  useMediaQuery,
  useTheme,
  Stack,
  Card,
  CardHeader,
  CardContent,
  Typography,
  Grid,
} from "@mui/material";
import {
  OF_STATUT_CHOICES_RA,
  OrdreFabrication,
} from "@/types/resources/OrdreFabrication";
import RowActions from "@/components/admin/common/row-actions";
import { formatDate } from "@/lib/utils/date";
import { OrdreFabricationStatutChip } from "../common/OrdreFabricationStatutChip";

const filters = [
  <SearchInput key="search" source="ref" alwaysOn />,
  <ReferenceInput key="client" source="client" reference="api/clients">
    <AutocompleteInput optionText="nom" label="Client" />
  </ReferenceInput>,
  <SelectInput
    key="statut"
    source="statut"
    choices={OF_STATUT_CHOICES_RA}
    label="Statut"
  />,
  <DateInput
    key="date_after"
    source="dateCreation.after"
    label="Date de création (min)"
  />,
  <DateInput
    key="date_before"
    source="dateCreation.before"
    label="Date de création (max)"
  />,
  <BooleanInput key="urgent" source="urgent" label="Urgent" />,
];

const ListActions = () => (
  <TopToolbar>
    <FilterButton />
    <ExportButton />
  </TopToolbar>
);

interface PartialFieldProps extends Partial<FieldProps> {
  record?: OrdreFabrication;
  source?: string;
  label?: string;
}

const PriorityField = ({ record, source }: PartialFieldProps) => {
  const contextRecord = useRecordContext<OrdreFabrication>({ record, source });
  const ordreFabrication = record ?? contextRecord;
  if (!ordreFabrication || !ordreFabrication.urgent) return null;
  return (
    <Box display="flex" gap={0.5} flexDirection="column">
      <Chip label="URGENT" size="small" variant="outlined" color="warning" />
    </Box>
  );
};

const prixTotaleFR = (ordreFabrication: OrdreFabrication) => {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(
    ordreFabrication.quantiteTotale *
      Number.parseFloat(ordreFabrication.prixUnitaire),
  );
};

const MobileOrdreFabricationList = () => {
  const { data, isLoading } = useListContext<OrdreFabrication>();

  if (isLoading)
    return (
      <Box sx={{ textAlign: "center", color: "text.secondary" }}>
        Chargement...
      </Box>
    );

  if (!data || data.length === 0) {
    return (
      <Box sx={{ textAlign: "center", color: "text.secondary" }}>
        Aucun enregistrement trouvé
      </Box>
    );
  }

  return (
    <Stack spacing={3} sx={{ p: 2 }}>
      {data?.map((record) => (
        <Card key={record.id} className="border-l-4 border-l-primary">
          <CardHeader
            action={
              <Stack alignItems="flex-end" spacing={1}>
                <RowActions<OrdreFabrication>
                  resource="api/ordre_fabrications"
                  record={record}
                  hideActions={{ delete: true, edit: true }}
                />
                <PriorityField record={record} />
                <OrdreFabricationStatutChip record={record} />
              </Stack>
            }
            title={record.ref}
            subheader={`Crée le: ${formatDate(record.dateCreation)}`}
          />
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography className="text-muted-foreground font-medium">
                  DATE DE CLOTURE
                </Typography>
                <Typography>{formatDate(record.dateCloture ?? "-")}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography className="text-muted-foreground font-medium">
                  ARTICLE
                </Typography>
                <Link
                  to={`/api/articles/${encodeURIComponent(
                    record.article["@id"],
                  )}/show`}
                >
                  <Typography>{`(${record.article.ref}) ${record.article.designation}`}</Typography>
                </Link>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography className="text-muted-foreground font-medium">
                  CLIENT
                </Typography>
                <Link
                  to={`/api/clients/${encodeURIComponent(
                    record.client["@id"],
                  )}/show`}
                >
                  <Typography>{`(${record.client.ref}) ${record.client.nom}`}</Typography>
                </Link>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography className="text-muted-foreground font-medium">
                  QUANTITÉ DEMANDÉE
                </Typography>
                <Typography>{record.quantiteTotale}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography className="text-muted-foreground font-medium">
                  PRIX TOTALE
                </Typography>
                <Typography>{prixTotaleFR(record)}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography className="text-muted-foreground font-medium">
                  TEMPS UNITAIRE (CMN)
                </Typography>
                <Typography>{record.tempsUnitaire}</Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      ))}
    </Stack>
  );
};

export const OrdreFabricationList = () => {
  const theme = useTheme();
  const isMedium = useMediaQuery(theme.breakpoints.down("md"), {
    noSsr: true,
  });

  return (
    <List
      filters={filters}
      actions={<ListActions />}
      sort={{ field: "dateCreation", order: "DESC" }}
    >
      {isMedium ? (
        <MobileOrdreFabricationList />
      ) : (
        <Datagrid rowClick={false} bulkActionButtons={false}>
          <TextField source="ref" label="Référence" />
          <FunctionField<OrdreFabrication>
            label="Client"
            render={(record) => (
              <Link
                to={`/api/clients/${encodeURIComponent(
                  record.client["@id"],
                )}/show`}
              >
                {`(${record.client.ref}) ${record.client.nom}`}
              </Link>
            )}
          />
          <FunctionField<OrdreFabrication>
            label="Article"
            render={(record) => (
              <Link
                to={`/api/articles/${encodeURIComponent(
                  record.article["@id"],
                )}/show`}
              >
                {`(${record.article.ref}) ${record.article.designation}`}
              </Link>
            )}
          />
          <DateField source="dateCreation" label="Date création" />
          <DateField source="dateCloture" label="Date clôture" />
          <NumberField source="quantiteTotale" label="Quantité demandée" />
          <TextField source="tempsUnitaire" label="Temps Unitaire (cmn)" />
          <FunctionField<OrdreFabrication>
            label="Prix totale"
            render={(record) => prixTotaleFR(record)}
          />
          <FunctionField<OrdreFabrication>
            label="Statut"
            source="statut"
            render={(record) => <OrdreFabricationStatutChip record={record} />}
          />
          <PriorityField source="urgent" label="Priorité" />
          <RowActions<OrdreFabrication>
            resource="api/ordre_fabrications"
            hideActions={{ delete: true, edit: true }}
          />
        </Datagrid>
      )}
    </List>
  );
};
