import { Article } from "@/types/resources/Article";
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
import {
  List,
  Datagrid,
  TextField,
  ReferenceInput,
  AutocompleteInput,
  SearchInput,
  Identifier,
  useListContext,
} from "react-admin";
import RowActions from "@/components/admin/common/row-actions";
import { ClientReferenceField } from "@/components/admin/common/fields/ClientReferenceField";
import { OrdreFabricationsReferenceArrayField } from "@/components/admin/common/fields/OrdreFabricationsReferenceArrayField";

const filters = [
  <SearchInput key="search" source="ref" alwaysOn />,
  <ReferenceInput key="client" source="client" reference="api/clients">
    <AutocompleteInput optionText="nom" label="Client" />
  </ReferenceInput>,
];

const MobileArticleList = () => {
  const { data, isLoading } = useListContext<Article & { id: Identifier }>();

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
                <RowActions<Article> resource="api/articles" record={record} />
              </Stack>
            }
            title={record.designation}
            subheader={record.ref}
          />
          <CardContent>
            <Stack spacing={2}>
              <div>
                <p className="text-muted-foreground font-medium">COMPOSITION</p>
                <Typography
                  variant="body2"
                  sx={{
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {record.composition}
                </Typography>
              </div>
              <div>
                <p className="text-muted-foreground font-medium">CLIENT</p>
                <ClientReferenceField record={record} />
              </div>
              <div>
                <p className="text-muted-foreground font-medium">
                  ORDRES DE FABRICATION
                </p>
                <OrdreFabricationsReferenceArrayField record={record} />
              </div>
            </Stack>
          </CardContent>
        </Card>
      ))}
    </Stack>
  );
};

export const ArticleList = () => {
  const isSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.down("sm"));

  return (
    <List filters={filters}>
      {isSmall ? (
        <MobileArticleList />
      ) : (
        <Datagrid rowClick={false}>
          <TextField source="ref" />
          <TextField source="designation" />
          <ClientReferenceField label="Client" />
          <OrdreFabricationsReferenceArrayField label="Ordres de Fabrication" />
          <RowActions
            resource="api/articles"
            hideActions={{ edit: true, delete: true }}
          />
        </Datagrid>
      )}
    </List>
  );
};
