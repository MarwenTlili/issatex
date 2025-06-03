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
} from "react-admin";
import { Chip, Box } from "@mui/material";

const statutChoices = [
  { id: "CREE", name: "Créé" },
  { id: "EN_COURS", name: "En cours" },
  { id: "TERMINE", name: "Terminé" },
  { id: "ANNULE", name: "Annulé" },
  { id: "EN_ATTENTE", name: "En attente" },
];

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

const StatutField = () => {
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
      size="small"
      variant="filled"
    />
  );
};

const UrgentField = () => {
  const record = useRecordContext();
  if (!record) return null;

  return record.urgent ? (
    <Chip label="URGENT" color="error" size="small" variant="outlined" />
  ) : null;
};

const LanceField = () => {
  const record = useRecordContext();
  if (!record) return null;

  return record.lance ? (
    <Chip label="PLANIFIER" color="success" size="small" variant="filled" />
  ) : (
    <Chip label="NON PLANIFIER" color="default" size="small" variant="outlined" />
  );
};

const PriorityField = () => {
  const record = useRecordContext();
  if (!record) return null;

  return (
    <Box display="flex" gap={0.5} flexDirection="column">
      <UrgentField />
      <LanceField />
    </Box>
  );
};

export const OrdreFabricationList = () => (
  <List
    filters={filters}
    actions={<ListActions />}
    sort={{ field: "dateCreation", order: "DESC" }}
    perPage={25}
  >
    <Datagrid rowClick="show" bulkActionButtons={false}>
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
      <NumberField
        source="prixUnitaire"
        label="Prix unitaire"
        options={{ style: "currency", currency: "EUR" }}
      />
      {/* <FunctionField
        label="Valeur totale"
        render={(record: any) =>
          new Intl.NumberFormat("fr-FR", {
            style: "currency",
            currency: "EUR",
          }).format(
            record.quantiteTotale * Number.parseFloat(record.prixUnitaire)
          )
        }
      /> */}
      <StatutField />
      <PriorityField />
    </Datagrid>
  </List>
);
