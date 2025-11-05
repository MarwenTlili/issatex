import {
  List,
  Datagrid,
  TextField,
  SearchInput,
  useListContext,
  Identifier,
} from "react-admin";
import {
  useMediaQuery,
  Theme,
  Stack,
  Box,
  Card,
  CardHeader,
  CardContent,
  Typography,
} from "@mui/material";
import { Ilot } from "@/types/resources/Ilot";
import RowActions from "@/components/admin/common/row-actions";

const ilotListFilters = [<SearchInput key="search" source="ref" alwaysOn />];

const MobileIlotList = () => {
  const { data, isLoading } = useListContext<Ilot & { id: Identifier }>();

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
                <RowActions<Ilot> resource="api/ilots" record={record} />
              </Stack>
            }
            title={record.nom}
            subheader={record.ref}
          />
          <CardContent>
            <Stack spacing={2}>
              <div>
                <p className="text-muted-foreground font-medium">DESCRIPTION</p>
                <Typography
                  variant="body2"
                  sx={{
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {record.description}
                </Typography>
              </div>
            </Stack>
          </CardContent>
        </Card>
      ))}
    </Stack>
  );
};

export const IlotList = () => {
  const isSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.down("sm"));

  return (
    <List filters={ilotListFilters}>
      {isSmall ? (
        // Mobile display
        <MobileIlotList />
      ) : (
        // Desktop display
        <Datagrid rowClick={false}>
          <TextField source="ref" />
          <TextField source="nom" />
          <TextField
            source="description"
            sx={{
              display: "-webkit-box",
              WebkitLineClamp: 1,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: 250,
            }}
          />
          <RowActions<Ilot> resource="api/ilots" />
        </Datagrid>
      )}
    </List>
  );
};
