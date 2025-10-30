import {
  List,
  Datagrid,
  TextField,
  CreateButton,
  TopToolbar,
  FilterButton,
  SearchInput,
  SelectInput,
} from "react-admin";
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

export const EmployeList = () => (
  <List filters={EmployeFilters} actions={<EmployeListActions />}>
    <Datagrid rowClick={false}>
      <TextField source="ref" label="Ref" />
      <TextField source="nom" label="Nom" />
      <TextField source="prenom" label="Prénom" />
      <TextField source="poste" label="Poste" />
      <RowActions<Employe> resource="api/employes" />
    </Datagrid>
  </List>
);
