import React from "react";
import {
  Datagrid,
  FunctionField,
  ReferenceArrayField,
  TextField,
  useListContext,
} from "react-admin";
import {
  useMediaQuery,
  Theme,
  Chip,
  Box,
  Stack,
  Card,
  CardHeader,
  CardContent,
  Typography,
} from "@mui/material";
import { Presence, PRESENCE_STATUT } from "@/types/resources/Presence";
import { formatDate } from "@/lib/utils/date";
import RowActions from "@/components/admin/common/row-actions";

const PresenceStatutChip = ({ statut }: { statut: Presence["statut"] }) => {
  const { label, muiColor } = PRESENCE_STATUT[statut];
  return <Chip label={label} color={muiColor} />;
};

const MobilePresencesList = ({
  showIlot,
  showEmploye,
}: {
  showIlot: boolean;
  showEmploye: boolean;
}) => {
  const { data, isLoading } = useListContext<Presence>();

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
            title={record.ref}
            subheader={formatDate(record.datePresence)}
            action={
              <Stack alignItems="flex-end" spacing={1}>
                <RowActions<Presence>
                  resource="api/presences"
                  record={record}
                  hideActions={{ edit: true, delete: true }}
                />
                <PresenceStatutChip statut={record.statut} />
              </Stack>
            }
          />
          <CardContent>
            <Stack>
              <Box display="flex">
                <Typography color="text.secondary" sx={{ marginRight: 1 }}>
                  Date de présence
                </Typography>
                <Typography className="text-foreground">
                  {formatDate(record.datePresence)}
                </Typography>
              </Box>
              {showEmploye && (
                <Box display="flex">
                  <Typography color="text.secondary" sx={{ marginRight: 1 }}>
                    Employe
                  </Typography>
                  <Typography className="text-foreground">
                    {record.employe.nom} {record.employe.prenom}
                  </Typography>
                </Box>
              )}
              {showIlot && (
                <Box display="flex">
                  <Typography color="text.secondary" sx={{ marginRight: 1 }}>
                    Ilot
                  </Typography>
                  <Typography className="text-foreground">
                    {record.ilot.nom}
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

interface PresencesReferenceArrayFieldProps {
  showIlot?: boolean;
  showEmploye?: boolean;
  [key: string]: any;
}

export const PresencesReferenceArrayField = ({
  showIlot = true,
  showEmploye = true,
  ...props
}: PresencesReferenceArrayFieldProps) => {
  const isSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.down("sm"));

  return (
    <ReferenceArrayField
      reference="api/presences"
      source="presences"
      {...props}
    >
      {isSmall ? (
        <MobilePresencesList showEmploye={showEmploye} showIlot={showIlot} />
      ) : (
        <Datagrid bulkActionButtons={false}>
          <TextField source="ref" />
          <FunctionField<Presence>
            label="Date de présence"
            render={(record) => formatDate(record.datePresence)}
          />
          <FunctionField<Presence>
            label="Employe"
            render={(record) =>
              `${record.employe.nom} ${record.employe.prenom}`
            }
          />
          <FunctionField<Presence>
            label="Statut"
            render={(record) => <PresenceStatutChip statut={record.statut} />}
          />
        </Datagrid>
      )}
    </ReferenceArrayField>
  );
};
