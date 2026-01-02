import {
  ReferenceArrayField,
  Datagrid,
  TextField,
  FunctionField,
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
import { AffectationEmployeIlot } from "@/types/resources/AffectationEmployeIlot";
import { ResponsableFunctionField } from "./ResponsableFunctionField";
import RowActions from "@/components/admin/common/row-actions";

interface AffectationsReferenceArrayFieldProps {
  showEmploye?: boolean;
  showIlot?: boolean;
  [key: string]: any; // allow other react-admin props
}

const AffectationsCards = ({
  showEmploye,
  showIlot,
}: {
  showEmploye: boolean;
  showIlot: boolean;
}) => {
  const { data, isLoading } = useListContext<AffectationEmployeIlot>();

  if (isLoading || !data) return null;

  return (
    <Stack spacing={3}>
      {data.map((record) => (
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
              <Stack alignItems="flex-end" spacing={1}>
                <RowActions
                  resource="api/affectation_employe_ilots"
                  hideActions={{ delete: true, edit: true }}
                  record={record}
                />
                <ResponsableFunctionField record={record} />
              </Stack>
            }
          />
          <CardContent>
            <Stack>
              {showEmploye && (
                <Box display="flex">
                  <Typography color="text.secondary" sx={{ marginRight: 1 }}>
                    Employe
                  </Typography>
                  <Typography>
                    {record.employe.nom} {record.employe.prenom} -{" "}
                    {record.employe.poste}
                  </Typography>
                </Box>
              )}
              {showIlot && (
                <Box display="flex">
                  <Typography color="text.secondary" sx={{ marginRight: 1 }}>
                    Ilot
                  </Typography>
                  <Typography>{record.ilot.nom}</Typography>
                </Box>
              )}
            </Stack>
          </CardContent>
        </Card>
      ))}
    </Stack>
  );
};

export const AffectationsReferenceArrayField = ({
  showEmploye = true,
  showIlot = true,
  ...props
}: AffectationsReferenceArrayFieldProps) => {
  const isSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.down("sm"));

  return (
    <ReferenceArrayField
      reference="api/affectation_employe_ilots"
      source="affectations"
      {...props}
    >
      {isSmall ? (
        <AffectationsCards showEmploye={showEmploye} showIlot={showIlot} />
      ) : (
        <Datagrid bulkActionButtons={false}>
          <TextField source="ref" label="Référence" />
          {showEmploye && (
            <FunctionField<AffectationEmployeIlot>
              label="Employe"
              render={(record) =>
                `${record.employe.nom} ${record.employe.prenom} - ${record.employe.poste}`
              }
            />
          )}

          {showIlot && (
            <FunctionField<AffectationEmployeIlot>
              label="Ilot"
              render={(record) => `${record.ilot.nom}`}
            />
          )}
          <ResponsableFunctionField label="Responsable?" />
        </Datagrid>
      )}
    </ReferenceArrayField>
  );
};
