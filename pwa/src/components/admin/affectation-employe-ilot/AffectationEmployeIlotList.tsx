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
  SearchInput,
  ReferenceField,
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
      <ReferenceField source="employe" reference="employes" label="Employee">
        <TextField source="nom" />
      </ReferenceField>
      <ReferenceField source="employe" reference="employes" label="First Name">
        <TextField source="prenom" />
      </ReferenceField>
      <ReferenceField source="employe" reference="employes" label="Position">
        <TextField source="poste" />
      </ReferenceField>
      <ReferenceField source="ilot" reference="ilots" label="Workshop">
        <TextField source="nom" />
      </ReferenceField>
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
