import {
  List,
  Datagrid,
  TextField,
  DateField,
  ReferenceField,
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
  SimpleList,
  useGetOne,
} from "react-admin";
import { Chip, Box, ChipProps, useMediaQuery, useTheme } from "@mui/material";
import { OrdreFabrication, StatutOF } from "@/types/resources/OrdreFabrication";
import RowActions from "@/components/admin/common/row-actions";

const statutChoices = [
  { id: "CREE", name: "Créé" },
  { id: "PLANIFIE", name: "Planifié" },
  { id: "EN_COURS", name: "En cours" },
  { id: "TERMINE", name: "Terminé" },
  { id: "ANNULE", name: "Annulé" },
];

const getStatutColor = (statut: StatutOF): ChipProps["color"] => {
  switch (statut) {
    case "Cree":
      return "default";
    case "Planifiee":
      return "info";
    case "En_cours":
      return "primary";
    case "Terminee":
      return "success";
    case "Annule":
      return "error";
    default:
      return "default";
  }
};

const getStatutLabel = (statut: StatutOF): string => {
  switch (statut) {
    case "Cree":
      return "Créée";
    case "Planifiee":
      return "Planifiée";
    case "En_cours":
      return "En cours";
    case "Terminee":
      return "Terminée";
    case "Annule":
      return "Annulée";
    default:
      return statut;
  }
};

const filters = [
  <SearchInput key="search" source="ref" alwaysOn />,
  <ReferenceInput key="client" source="client" reference="api/clients">
    <AutocompleteInput optionText="nom" label="Client" />
  </ReferenceInput>,
  <SelectInput
    key="statut"
    source="statut"
    choices={statutChoices}
    label="Statut"
  />,
  <DateInput
    key="dateCreation"
    source="dateCreation"
    label="Date de création"
  />,
  <BooleanInput key="urgent" source="urgent" label="Urgent" />,
  <BooleanInput key="lance" source="lance" label="Lancé en production" />,
];

const ListActions = () => (
  <TopToolbar>
    <FilterButton />
    <ExportButton />
  </TopToolbar>
);

const StatutField = (props: FieldProps) => {
  const record = useRecordContext(props);
  if (!record) return null;

  return (
    <Chip
      label={getStatutLabel(record.statut)}
      color={getStatutColor(record.statut)}
      size="small"
      variant="filled"
    />
  );
};

const PriorityField = (props: FieldProps) => {
  const record = useRecordContext(props);
  if (!record) return null;

  return (
    <Box display="flex" gap={0.5} flexDirection="column" {...props}>
      {record.urgent && (
        <Chip label="URGENT" color="warning" size="small" variant="filled" />
      )}
    </Box>
  );
};

const ClientArticleText = ({ record }: { record: any }) => {
  const { data: client } = useGetOne("api/clients", {
    id: record?.client,
  });
  const { data: article } = useGetOne("api/articles", {
    id: record?.article,
  });

  const clientName = client?.nom ?? "Client inconnu";
  const articleName = article?.designation ?? "Article inconnu";

  return `${clientName} · ${articleName}`;
};

export const OrdreFabricationList = () => {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("md"), {
    noSsr: true,
  });

  return (
    <List
      filters={filters}
      actions={<ListActions />}
      sort={{ field: "dateCreation", order: "DESC" }}
    >
      {isSmall ? (
        <SimpleList
          primaryText={(record) => (
            <Box sx={{ display: "flex", gap: 2 }}>
              {record.ref}
              <PriorityField source="urgent" label="Priorité" />
            </Box>
          )}
          secondaryText={(record) => <ClientArticleText record={record} />}
          tertiaryText={(record) => (
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              width="100%"
            >
              <Box sx={{ color: "text.secondary" }}>
                {new Date(record.dateCreation).toLocaleDateString("fr-FR", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </Box>
              <Chip
                label={getStatutLabel(record.statut)}
                color={getStatutColor(record.statut)}
                size="small"
                variant="filled"
                sx={{ ml: 1 }}
              />
            </Box>
          )}
          rowClick="show"
        />
      ) : (
        <Datagrid rowClick={false} bulkActionButtons={false}>
          <TextField source="ref" label="Référence" />
          <ReferenceField
            source="client"
            reference="api/clients"
            link="show"
            label="Client"
          >
            <TextField source="nom" />
          </ReferenceField>
          <ReferenceField
            source="article"
            reference="api/articles"
            link="show"
            label="Article"
          >
            <TextField source="designation" />
          </ReferenceField>
          <DateField source="dateCreation" label="Date création" />
          <DateField source="dateCloture" label="Date clôture" />
          <NumberField source="quantiteTotale" label="Quantité demandée" />
          <FunctionField
            label="Valeur totale"
            render={(record: any) =>
              new Intl.NumberFormat("fr-FR", {
                style: "currency",
                currency: "EUR",
              }).format(
                record.quantiteTotale * Number.parseFloat(record.prixUnitaire)
              )
            }
          />
          <StatutField source="statut" />
          <PriorityField source="urgent" label="Priorité" />
          <RowActions<OrdreFabrication>
            resource="api/ordre_fabrications"
            hideActions={{ edit: true }}
          />
        </Datagrid>
      )}
    </List>
  );
};
