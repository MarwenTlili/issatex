import {
  Create,
  SaveButton,
  SimpleForm,
  TextInput,
  Toolbar,
  required,
  useNotify,
  useRedirect,
} from "react-admin";

import { Ilot } from "@/types/resources/Ilot";
import { useFormState } from "react-hook-form";

const CustomToolbar = () => {
  const { isValid, isSubmitting } = useFormState();

  return (
    <Toolbar>
      <SaveButton label="Enregister" disabled={!isValid || isSubmitting} />
    </Toolbar>
  );
};

export const IlotCreate = () => {
  const notify = useNotify();
  const redirect = useRedirect();

  const onSuccess = () => {
    notify("L’îlot a été créé avec succès", { type: "success" });
    redirect("list", "api/ilots");
  };

  const onError = (error: any) => {
    notify(`La création de l’îlot a échoué, ${error}`, {
      type: "error",
    });
  };

  return (
    <Create<Ilot>
      title="Nouveau Ilot"
      redirect="list"
      mutationOptions={{ onSuccess, onError }}
    >
      <SimpleForm toolbar={<CustomToolbar />}>
        <TextInput source="nom" validate={required()} fullWidth />
        <TextInput source="description" multiline rows={4} fullWidth />
      </SimpleForm>
    </Create>
  );
};
