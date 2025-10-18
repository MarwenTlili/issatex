import {
  List,
  Datagrid,
  TextField,
  BooleanField,
  EditButton,
  DeleteButton,
  ShowButton,
  ReferenceInput,
  SelectInput,
  TopToolbar,
  CreateButton,
  ExportButton,
  FilterButton,
} from "react-admin";

const assignmentFilters = [
  // <SearchInput source="q" alwaysOn key="search" />,
  <ReferenceInput source="employe" reference="api/employes" key="employe">
    <SelectInput optionText="ref" />
  </ReferenceInput>,
  <ReferenceInput source="ilot" reference="api/ilots" key="ilot">
    <SelectInput optionText="nom" />
  </ReferenceInput>,
];

const AssignmentListActions = () => (
  <TopToolbar>
    <FilterButton />
    <CreateButton />
    <ExportButton />
  </TopToolbar>
);

export const AffectationEmployeIlotList = () => (
  <List
    filters={assignmentFilters}
    actions={<AssignmentListActions />}
    sx={{
      "& .RaList-content": {
        backgroundColor: "var(--color-background)",
      },
    }}
  >
    <Datagrid
      rowClick="show"
      sx={{
        "& .RaDatagrid-table": {
          backgroundColor: "var(--color-card)",
        },
        "& .RaDatagrid-headerCell": {
          backgroundColor: "var(--color-muted)",
          color: "var(--color-muted-foreground)",
          fontWeight: 600,
        },
      }}
    >
      <TextField source="ref" label="Reference" />
      <TextField source="employe.nom" label="Nom Emp" />
      <TextField source="employe.prenom" label="Prenom Emp" />
      <TextField source="employe.poste" label="Position" />
      <TextField source="ilot.ref" label="Ilot" />
      <BooleanField
        source="responsable"
        label="Responsible"
        sx={{
          "& .RaBooleanField-true": {
            color: "var(--color-chart-3)",
          },
          "& .RaBooleanField-false": {
            color: "var(--color-muted-foreground)",
          },
        }}
      />
      <ShowButton />
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
);
