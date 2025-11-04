import {
  List,
  Datagrid,
  TextField,
  ReferenceField,
  CreateButton,
  TopToolbar,
  FilterButton,
  SearchInput,
  SelectInput,
  ReferenceInput,
  useListContext,
  Identifier,
  useGetOne,
  useRecordContext,
  Link,
} from "react-admin";
import RowActions from "@/components/admin/common/row-actions";
import { Machine, StatutMachine, STATUTS } from "@/types/resources/Machine";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Chip,
  CircularProgress,
  Stack,
  Theme,
  useMediaQuery,
} from "@mui/material";
import { Ilot } from "@/types/resources/Ilot";
import { green, grey, red, orange } from "@mui/material/colors";

// array of choices for React-Admin SelectInput component (id, name)
export const statutChoices = STATUTS.map((s) => ({ id: s, name: s }));

export const STATUT_COLORS: Record<StatutMachine, string> = {
  AVAILABLE: green[500],
  UNAVAILABLE: grey[500],
  BROKEN: red[500],
  MAINTENANCE: orange[500],
};

const MachineFilters = [
  <SearchInput key="search" source="ref" alwaysOn />,
  <SelectInput
    key="statut"
    source="statut"
    label="Status"
    choices={statutChoices}
  />,
  <ReferenceInput key="ilot" source="ilot" reference="api/ilots">
    <SelectInput optionText="nom" />
  </ReferenceInput>,
];

const MachineListActions = () => (
  <TopToolbar>
    <FilterButton />
    <CreateButton />
  </TopToolbar>
);

export const IlotField = ({ record }: { record: Machine }) => {
  const { data, isLoading, error } = useGetOne<Ilot>("api/ilots", {
    id: record?.ilot as unknown as number | undefined,
  });

  if (!record?.ilot || !data) {
    return <Box>—</Box>;
  }

  if (isLoading) {
    return <CircularProgress size={16} />;
  }

  if (error) {
    return <Box className="text-destructive text-xs">Error loading</Box>;
  }

  return (
    <Box>
      <Link to={`/api/ilots/${encodeURIComponent(data["@id"])}/show`}>
        {data.nom}
      </Link>
    </Box>
  );
};

const MobileMachineList = () => {
  const { data, isLoading } = useListContext<Machine & { id: Identifier }>();

  if (isLoading) {
    return <Box sx={{ p: 2 }}>Loading...</Box>;
  }

  return (
    <Stack spacing={3} sx={{ p: 2 }}>
      {data?.map((record) => (
        <Card key={record.id} className="border-l-4 border-l-primary">
          <CardHeader
            action={
              <Stack alignItems="flex-end" spacing={1}>
                <RowActions<Machine> resource="api/machines" record={record} />
                <Chip
                  label={record.statut}
                  sx={{
                    backgroundColor: STATUT_COLORS[record.statut],
                    color: "white",
                    fontWeight: 500,
                    fontSize: 12,
                  }}
                />
              </Stack>
            }
            title={record.nom}
            subheader={record.ref}
          />
          <CardContent>
            <Stack spacing={2}>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground font-medium">
                    TYPE
                  </p>
                  <p className="text-foreground">{record.type}</p>
                </div>
              </div>
              {record.ilot && (
                <div>
                  <p className="text-xs text-muted-foreground font-medium">
                    ILOT
                  </p>
                  <IlotField record={record} />
                </div>
              )}
            </Stack>
          </CardContent>
        </Card>
      ))}
    </Stack>
  );
};

const StatutField = () => {
  const record = useRecordContext<Machine>();
  if (!record) return null;

  return (
    <TextField
      source="statut"
      sx={{
        backgroundColor: STATUT_COLORS[record.statut],
        color: "white",
        fontSize: 12,
        borderRadius: 10,
        p: 1,
      }}
    />
  );
};

export const MachineList = () => {
  const isSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.down("sm"));

  return (
    <List
      filters={MachineFilters}
      actions={<MachineListActions />}
      sort={{ field: "nom", order: "ASC" }}
    >
      {isSmall ? (
        <MobileMachineList />
      ) : (
        <Datagrid rowClick={false}>
          <TextField source="ref" label="Reference" />
          <TextField source="nom" label="Name" />
          <TextField source="type" label="Type" />
          <StatutField />
          <ReferenceField source="ilot" reference="api/ilots" label="Ilot">
            <TextField source="nom" />
          </ReferenceField>
          <RowActions resource="api/machines" />
        </Datagrid>
      )}
    </List>
  );
};
