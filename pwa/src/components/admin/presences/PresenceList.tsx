import {
  List,
  Datagrid,
  TextField,
  DateField,
  NumberField,
  ReferenceField,
  ShowButton,
  TopToolbar,
  FilterButton,
  SearchInput,
  DateInput,
  ReferenceInput,
  SelectInput,
} from "react-admin";

const PresenceFilters = [
  <SearchInput key="search" source="q" alwaysOn />,
  <DateInput key="datePresence" source="datePresence" label="Date" />,
  <ReferenceInput key="employe" source="employe" reference="api/employes">
    <SelectInput
      optionText={(record: any) => `${record.prenom} ${record.nom}`}
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
      <ReferenceField source="employe" reference="api/employes">
        <TextField source="nom" />
      </ReferenceField>
      <ReferenceField source="production" reference="api/productions">
        <TextField source="ref" />
      </ReferenceField>
      <TextField source="statut" />
      <NumberField source="tempsPresence" label="Temps de Présence (H)" />
      <ShowButton />
    </Datagrid>
  </List>
);
