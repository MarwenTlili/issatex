import {
  List,
  Datagrid,
  TextField,
  DateField,
  BooleanField,
  CreateButton,
  TopToolbar,
  FilterButton,
  SearchInput,
  DateInput,
  ReferenceInput,
  SelectInput,
  Identifier,
  useListContext,
  Link,
  FunctionField,
} from "react-admin";
import RowActions from "@/components/admin/common/row-actions";
import { Planning } from "@/types/resources/Planning";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Grid,
  Stack,
  Theme,
  useMediaQuery,
} from "@mui/material";
import { formatDate } from "@/lib/utils/date";
import { OrdreFabricationStatutChip } from "../common/OrdreFabricationStatutChip";

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

const MobilePlanningList = () => {
  const { data, isLoading } = useListContext<Planning>();

  if (isLoading) {
    return <Box sx={{ p: 2 }}>Loading...</Box>;
  }

  return (
    <Stack spacing={3} sx={{ p: 2 }}>
      {data?.map((record) => (
        <Card key={record.id} className="border-l-4 border-l-primary">
          <CardHeader
            title={`${record.ref}`}
            subheader={`Crée le: ${formatDate(record.dateCreation ?? "-")}`}
            action={
              <Stack alignItems="flex-end" spacing={1}>
                <RowActions<Planning>
                  resource="api/plannings"
                  record={record}
                />
                {record.reporte && <Chip label="Reporté" color="primary" />}
              </Stack>
            }
          />
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <p className="text-muted-foreground font-medium">
                  DATE DE DEBUT
                </p>
                <p className="text-foreground">{record.dateDebut}</p>
              </Grid>
              <Grid item xs={12} sm={6}>
                <p className="text-muted-foreground font-medium">DATE DE FIN</p>
                <p className="text-foreground">{record.dateFin}</p>
              </Grid>
              <Grid item xs={12} sm={6}>
                <p className="text-muted-foreground font-medium">
                  ORDRE DE FABRICATION
                </p>
                <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                  <p className="text-foreground">
                    <Link
                      to={`/api/ordre_fabrications/${encodeURIComponent(
                        record.ordreFabrication["@id"]
                      )}/show`}
                    >
                      {record.ordreFabrication.ref}
                    </Link>
                  </p>
                  <OrdreFabricationStatutChip
                    record={record.ordreFabrication}
                    props={{
                      variant: "outlined",
                    }}
                  />
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <p className="text-muted-foreground font-medium">ILOT</p>
                <p className="text-foreground">
                  <Link
                    to={`/api/ilots/${encodeURIComponent(
                      record.ilot["@id"]
                    )}/show`}
                  >
                    {record.ilot.nom}
                  </Link>
                </p>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      ))}
    </Stack>
  );
};

export const PlanningList = () => {
  const isMedium = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("md")
  );

  return (
    <List
      filters={PlanningFilters}
      actions={<PlanningListActions />}
      sort={{ field: "dateCreation", order: "DESC" }}
    >
      {isMedium ? (
        <MobilePlanningList />
      ) : (
        <Datagrid rowClick={false}>
          <TextField
            source="ref"
            sx={{ whiteSpace: "nowrap", overflow: "hidden" }}
          />
          <DateField source="dateCreation" />
          <DateField source="dateDebut" />
          <DateField source="dateFin" />
          <FunctionField<Planning>
            label="Ordre de fabrication"
            render={(record) => (
              <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                <Link
                  to={`/api/ordre_fabrications/${encodeURIComponent(
                    record.ordreFabrication["@id"]
                  )}/show`}
                  sx={{ whiteSpace: "nowrap", overflow: "hidden" }}
                >
                  {record.ordreFabrication.ref}
                </Link>
                <OrdreFabricationStatutChip
                  record={record.ordreFabrication}
                  props={{
                    variant: "outlined",
                  }}
                />
              </Box>
            )}
          />
          <FunctionField<Planning>
            label="Ilot"
            render={(record) => (
              <Link
                to={`/api/ilots/${encodeURIComponent(record.ilot["@id"])}/show`}
              >
                {record.ilot.nom}
              </Link>
            )}
          />
          <BooleanField source="reporte" label="Reporté?" />
          <RowActions resource="api/plannings" />
        </Datagrid>
      )}
    </List>
  );
};
