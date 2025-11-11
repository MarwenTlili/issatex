import React from "react";
import {
  Datagrid,
  FunctionField,
  Identifier,
  ReferenceArrayField,
  TextField,
  useListContext,
} from "react-admin";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Grid,
  Stack,
  Theme,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { Machine, MACHINE_STATUT } from "@/types/resources/Machine";
import RowActions from "@/components/admin/common/row-actions";
import { IlotReferenceField } from "./IlotReferenceField";

interface MachinesReferenceArrayFieldProps {
  showIlot?: boolean;
  [key: string]: any;
}

const MobileMachinesList = ({ showIlot }: { showIlot: boolean }) => {
  const { data, isLoading } = useListContext<Machine & { id: Identifier }>();

  if (isLoading)
    return (
      <Box sx={{ textAlign: "center", color: "text.secondary" }}>
        Chargement...
      </Box>
    );

  if (!data || data.length === 0) {
    return (
      <Box sx={{ textAlign: "center", color: "text.secondary" }}>
        Aucun enregistrement trouvé
      </Box>
    );
  }

  return (
    <Stack spacing={3}>
      {data?.map((record) => (
        <Card
          key={record.id}
          sx={{
            borderLeft: 3,
            borderColor: "primary.main",
            borderRadius: 2,
            boxShadow: 1,
          }}
        >
          <CardHeader
            title={record.nom}
            subheader={record.ref}
            action={
              <Stack alignItems="flex-end" spacing={1}>
                <RowActions<Machine> resource="api/machines" record={record} />
                <Chip
                  label={record.statut}
                  color={MACHINE_STATUT[record.statut].muiColor}
                />
              </Stack>
            }
          />
          <CardContent>
            <Stack>
              <Box display="flex">
                <Typography color="text.secondary" sx={{ marginRight: 1 }}>
                  Type
                </Typography>
                <Typography className="text-foreground">
                  {record.type}
                </Typography>
              </Box>
              {showIlot && (
                <Box display="flex">
                  <Typography color="text.secondary" sx={{ marginRight: 1 }}>
                    Ilot
                  </Typography>
                  <Typography>
                    <IlotReferenceField label="Ilot" record={record} />
                  </Typography>
                </Box>
              )}
            </Stack>
          </CardContent>
        </Card>
      ))}
    </Stack>
  );
};

export const MachinesReferenceArrayField = ({
  showIlot = true,
  ...props
}: MachinesReferenceArrayFieldProps) => {
  const isSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.down("sm"));

  return (
    <ReferenceArrayField reference="api/machines" source="machines" {...props}>
      {isSmall ? (
        <MobileMachinesList showIlot={showIlot} />
      ) : (
        <Datagrid bulkActionButtons={false}>
          <TextField source="ref" style={{ whiteSpace: "nowrap" }} />
          <TextField source="nom" />
          <TextField source="type" />
          <FunctionField<Machine>
            label="Statut"
            render={(record) => (
              <Chip
                label={record.statut}
                color={MACHINE_STATUT[record.statut].muiColor}
              />
            )}
          />
          {showIlot && <IlotReferenceField label="Ilot" />}
        </Datagrid>
      )}
    </ReferenceArrayField>
  );
};
