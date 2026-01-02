import {
  BooleanField,
  Datagrid,
  DateField,
  ReferenceArrayField,
  TextField,
  useListContext,
} from "react-admin";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Stack,
  Theme,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { Clear, Done } from "@mui/icons-material";

import RowActions from "@/components/admin/common/row-actions";
import { Planning } from "@/types/resources/Planning";
import { formatDate } from "@/lib/utils/date";

const PlanningsCards = () => {
  const { data, isLoading } = useListContext<Planning>();

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
    <Stack spacing={2}>
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
            title={record.ref}
            action={
              <RowActions<Planning>
                resource="api/plannings"
                hideActions={{ delete: true, edit: true }}
                record={record}
              />
            }
          />

          <CardContent>
            <Stack>
              <Box display="flex">
                <Typography color="text.secondary" sx={{ marginRight: 1 }}>
                  Créé le:
                </Typography>
                <Typography>{formatDate(record.dateCreation)}</Typography>
              </Box>

              <Box display="flex">
                <Typography color="text.secondary" sx={{ marginRight: 1 }}>
                  Début:
                </Typography>
                <Typography>{formatDate(record.dateDebut)}</Typography>
              </Box>

              <Box display="flex">
                <Typography color="text.secondary" sx={{ marginRight: 1 }}>
                  Fin:
                </Typography>
                <Typography>{formatDate(record.dateFin)}</Typography>
              </Box>

              <Box display="flex">
                <Typography color="text.secondary" sx={{ marginRight: 1 }}>
                  Reporté:
                </Typography>
                <Box display="flex" alignItems="center">
                  {record.reporte ? (
                    <Done color="success" fontSize="small" />
                  ) : (
                    <Clear color="error" fontSize="small" />
                  )}
                </Box>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      ))}
    </Stack>
  );
};

export const PlanningsReferenceArrayField = (props: any) => {
  const isSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.down("sm"));

  return (
    <ReferenceArrayField
      reference="api/plannings"
      source="plannings"
      {...props}
    >
      {isSmall ? (
        <PlanningsCards />
      ) : (
        <Datagrid bulkActionButtons={false}>
          <TextField source="ref" />
          <DateField source="dateCreation" />
          <DateField source="dateDebut" />
          <DateField source="dateFin" />
          <BooleanField source="reporte" />
        </Datagrid>
      )}
    </ReferenceArrayField>
  );
};
