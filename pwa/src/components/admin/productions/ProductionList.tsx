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

const ProductionFilters = [
  <SearchInput key="search" source="q" alwaysOn />,
  <DateInput
    key="dateProduction"
    source="dateProduction"
    label="Production Date"
  />,
  <ReferenceInput
    key="planning"
    source="planning"
    reference="api/plannings"
    label="Planning"
  >
    <SelectInput optionText="ref" />
  </ReferenceInput>,
  <SelectInput
    key="tailleArticle"
    source="tailleArticle"
    label="Size"
    choices={[
      { id: "M", name: "M" },
      { id: "L", name: "L" },
      { id: "XL", name: "XL" },
    ]}
  />,
];

const ProductionListActions = () => (
  <TopToolbar>
    <FilterButton />
  </TopToolbar>
);

export const ProductionList = () => (
  <List
    filters={ProductionFilters}
    actions={<ProductionListActions />}
    sort={{ field: "dateProduction", order: "DESC" }}
  >
    <Datagrid>
      <TextField source="ref" />
      <DateField source="dateProduction" />
      <ReferenceField source="planning" reference="api/plannings">
        <TextField source="ref" />
      </ReferenceField>
      <TextField source="tailleArticle" />
      <NumberField source="quantitePremiereChoix" />
      <NumberField source="quantiteDeuxiemeChoix" />
      <NumberField source="quantiteTotale" />
      <ShowButton />
    </Datagrid>
  </List>
);
