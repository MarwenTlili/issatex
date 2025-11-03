import {
  List,
  Datagrid,
  TextField,
  DateField,
  ReferenceField,
  BooleanField,
  CreateButton,
  TopToolbar,
  FilterButton,
  SearchInput,
  DateInput,
  ReferenceInput,
  SelectInput,
} from "react-admin";
import RowActions from "../common/row-actions";

const PlanningFilters = [
  <SearchInput key="search" source="ref" alwaysOn />,
  <DateInput key="dateDebut" source="dateDebut" label="Start Date" />,
  <DateInput key="dateFin" source="dateFin" label="End Date" />,
  <ReferenceInput key="ilot" source="ilot" reference="api/ilots">
    <SelectInput optionText="nom" />
  </ReferenceInput>,
];

const PlanningListActions = () => (
  <TopToolbar>
    <FilterButton />
    <CreateButton />
  </TopToolbar>
);

export const PlanningList = () => (
  <List
    filters={PlanningFilters}
    actions={<PlanningListActions />}
    sort={{ field: "dateCreation", order: "DESC" }}
  >
    <Datagrid rowClick={false}>
      <TextField source="ref" />
      <DateField source="dateCreation" />
      <DateField source="dateDebut" />
      <DateField source="dateFin" />
      <ReferenceField
        source="ordreFabrication"
        reference="api/ordre_fabrications"
        label="O/F"
      >
        <TextField source="ref" />
      </ReferenceField>
      <ReferenceField source="ilot" reference="api/ilots">
        <TextField source="nom" />
      </ReferenceField>
      <BooleanField source="reporte" label="Reporté" />
      <RowActions resource="api/plannings" />
    </Datagrid>
  </List>
);
