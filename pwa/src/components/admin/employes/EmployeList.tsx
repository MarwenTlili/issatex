import {
  List,
  Datagrid,
  TextField,
  CreateButton,
  TopToolbar,
  FilterButton,
  SearchInput,
  SelectInput,
  SimpleList,
  FunctionField,
} from "react-admin";
import { useMediaQuery, Theme } from "@mui/material";
import RowActions from "@/components/admin/common/row-actions";
import { Employe } from "@/types/resources/Employe";

const employePostChoices = [
  { id: "Tisseur", name: "Tisseur" },
  { id: "Fileur", name: "Fileur" },
  { id: "Teinturier", name: "Teinturier" },
  { id: "Imprimeur", name: "Imprimeur" },
  { id: "Couturier", name: "Couturier" },
  { id: "Tailleurs", name: "Tailleurs" },
  { id: "Opérateur de machine", name: "Opérateur de machine" },
];

const EmployeFilters = [
  <SearchInput key="search" source="ref" alwaysOn />,
  <SelectInput key="poste" source="poste" choices={employePostChoices} />,
];

const EmployeListActions = () => (
  <TopToolbar>
    <FilterButton />
    <CreateButton />
  </TopToolbar>
);

export const EmployeList = () => {
  const isSmall = useMediaQuery((theme: Theme) => theme.breakpoints.down("sm"));

  return (
    <List filters={EmployeFilters} actions={<EmployeListActions />}>
      {isSmall ? (
        <SimpleList
          primaryText={(record: Employe) => record.nom + " " + record.prenom}
          secondaryText={(record: Employe) => record.poste}
          tertiaryText={(record: Employe) => record.ref}
        />
      ) : (
        <Datagrid rowClick={false}>
          <TextField source="ref" label="Ref" sx={{ whiteSpace: "nowrap" }} />
          <TextField source="nom" label="Nom" />
          <TextField source="prenom" label="Prénom" />
          <TextField source="poste" label="Poste" />
          <FunctionField
            label="Affecté?"
            render={(record: Employe) =>
              record.affectations && record.affectations.length > 0
                ? "Oui"
                : "Non"
            }
          />
          <FunctionField
            label="Présences"
            render={(record: Employe) =>
              record.presences ? record.presences.length : 0
            }
          />
          <RowActions<Employe> resource="api/employes" />
        </Datagrid>
      )}
    </List>
  );
};
