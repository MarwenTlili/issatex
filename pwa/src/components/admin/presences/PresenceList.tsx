import { formatDecimalHours } from "@/lib/utils/date";
import {
  List,
  Datagrid,
  TextField,
  DateField,
  ShowButton,
  TopToolbar,
  FilterButton,
  SearchInput,
  ReferenceInput,
  SelectInput,
  AutocompleteInput,
  FunctionField,
} from "react-admin";

const PresenceFilters = [
  <SearchInput key="search" source="q" alwaysOn />,
  <ReferenceInput key="employe" source="employe" reference="api/employes">
    <AutocompleteInput
      optionText={(record: any) =>
        `${record.prenom} ${record.nom} (${record.ref})`
      }
      filterToQuery={(searchText: string) => ({
        ref: searchText,
      })}
      slotProps={{
        paper: {
          sx: {
            minWidth: "300px", // Ensure minimum width for dropdown
            maxWidth: "400px", // Prevent it from getting too wide
            "& .MuiAutocomplete-option": {
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
              overflow: "hidden",
              padding: "8px 16px",
            },
          },
        },
        popper: {
          sx: {
            width: "fit-content !important",
            minWidth: "300px",
          },
        },
      }}
    />
  </ReferenceInput>,
  <SelectInput
    key="statut"
    source="statut"
    choices={[
      { id: "Present", name: "Présent" },
      { id: "Absent", name: "Absent" },
      { id: "Retard", name: "Retard" },
      { id: "Conge", name: "Congé" },
    ]}
  />,
];

const PresenceListActions = () => (
  <TopToolbar>
    <FilterButton />
  </TopToolbar>
);

export const PresenceList = () => (
  <List
    filters={PresenceFilters}
    actions={<PresenceListActions />}
    sort={{ field: "datePresence", order: "DESC" }}
  >
    <Datagrid>
      <TextField source="ref" />
      <DateField source="datePresence" />
      <FunctionField
        label="Employé"
        render={(record) =>
          `${record?.employe?.nom} - ${record?.employe?.prenom} (${record?.employe?.ref})`
        }
      />
      <FunctionField label="Ilot" render={(record) => record.ilot.nom} />
      <TextField source="statut" />
      <FunctionField
        label="Temps de Présence"
        render={(record) => formatDecimalHours(record.tempsPresence)}
      />
      <ShowButton />
    </Datagrid>
  </List>
);
