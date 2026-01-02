import { Ilot } from "@/types/resources/Ilot";
import {
  Edit,
  SaveButton,
  SimpleForm,
  TextInput,
  Toolbar,
  required,
  useNotify,
  useRecordContext,
  useRedirect,
} from "react-admin";
import { useFormState } from "react-hook-form";

const CustomToolbar = () => {
  const { isValid, isSubmitting } = useFormState();

  return (
    <Toolbar>
      <SaveButton
        label="Enregister"
        disabled={!isValid || isSubmitting}
        alwaysEnable={false}
      />
    </Toolbar>
  );
};

const CustomTitle = () => {
  const record = useRecordContext<Ilot>();
  return `${record?.ref}`;
};

export const IlotEdit = () => {
  const notify = useNotify();
  const redirect = useRedirect();

  const onSuccess = async (data: Ilot) => {
    notify("L’îlot a été modifier avec succès", { type: "success" });
    redirect("list", "api/ilots");
  };

  const onError = (error: any) => {
    notify(`La modification de l’îlot a échoué, ${error}`, {
      type: "error",
    });
  };

  return (
    <Edit<Ilot>
      title={<CustomTitle />}
      redirect="list"
      mutationOptions={{ onSuccess, onError }}
      mutationMode="pessimistic"
    >
      <SimpleForm toolbar={<CustomToolbar />}>
        <TextInput source="ref" label="Réf" disabled fullWidth />
        <TextInput source="nom" validate={required()} fullWidth />
        <TextInput source="description" multiline rows={4} fullWidth />
      </SimpleForm>
    </Edit>
  );
};
