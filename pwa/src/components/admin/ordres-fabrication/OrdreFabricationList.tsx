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
  DeleteButton,
} from "react-admin";
import { Chip, Box, ChipProps } from "@mui/material";
import { StatutOF } from "@/types/resources/OrdreFabrication";

const statutChoices = [
  { id: "CREE", name: "Créé" },
  { id: "PLANIFIE", name: "Planifié" },
  { id: "EN_COURS", name: "En cours" },
  { id: "TERMINE", name: "Terminé" },
  { id: "ANNULE", name: "Annulé" },
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

const StatutField = (props: any) => {
  const record = useRecordContext();
  if (!record) return null;

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

  return (
    <Chip
      label={getStatutLabel(record.statut)}
      color={getStatutColor(record.statut)}
      size="small"
      variant="filled"
    />
  );
};

const PriorityField = (props: any) => {
  const record = useRecordContext();
  if (!record) return null;

  return (
    <Box display="flex" gap={0.5} flexDirection="column">
      {record.urgent && (
        <Chip label="URGENT" color="warning" size="small" variant="filled" />
      )}
    </Box>
  );
};

const LanceField = (props: any) => {
  const record = useRecordContext();
  if (!record || record.statut === "Terminee") return null;
  return (
    <Chip
      label={record.lance ? "LANCÉE" : "NON LANCÉE"}
      color={record.lance ? "primary" : "default"}
      size="small"
      variant={record.lance ? "filled" : "outlined"}
    />
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
      <StatutField label="Statut" />
      <LanceField label="En Production"/>
      <PriorityField label="Priorité" />
      <DeleteButton mutationMode="pessimistic" />
    </Datagrid>
  </List>
);
