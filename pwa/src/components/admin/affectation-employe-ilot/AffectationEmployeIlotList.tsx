import {
  List,
  Datagrid,
  TextField,
  BooleanField,
  ReferenceInput,
  SelectInput,
  TopToolbar,
  CreateButton,
  ExportButton,
  FilterButton,
  SimpleList,
} from "react-admin";
import RowActions from "@/components/admin/common/row-actions";
import { Box, Theme, useMediaQuery } from "@mui/material";
import { Clear, Done } from "@mui/icons-material";

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

export const AffectationEmployeIlotList = () => {
  const isSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.down("sm"));

  return (
    <List filters={assignmentFilters} actions={<AssignmentListActions />}>
      {isSmall ? (
        <SimpleList
          primaryText={(record) => `${record.ref}`}
          secondaryText={(record) =>
            `${record.employe.nom} ${record.employe.prenom} - ${record.employe.poste}`
          }
          tertiaryText={(record) => (
            <Box>
              <div>
                Responsable: {record.responsable ? <Done /> : <Clear />}
              </div>
              <div>Ilot: {record.ilot.nom}</div>
            </Box>
          )}
        />
      ) : (
        <Datagrid rowClick={false}>
          <TextField
            source="ref"
            label="Reference"
            sx={{ whiteSpace: "nowrap" }}
          />
          <TextField source="employe.nom" label="Nom Emp" />
          <TextField source="employe.prenom" label="Prenom Emp" />
          <TextField source="employe.poste" label="Position" />
          <TextField
            source="ilot.ref"
            label="Ilot"
            sx={{ whiteSpace: "nowrap" }}
          />
          <BooleanField source="responsable" label="Responsible" />
          <RowActions resource="api/affectation_employe_ilots" />
        </Datagrid>
      )}
    </List>
  );
};
