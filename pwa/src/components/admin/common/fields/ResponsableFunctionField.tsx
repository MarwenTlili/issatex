import { FunctionField } from "react-admin";
import { Chip } from "@mui/material";
import { orange } from "@mui/material/colors";
import { AffectationEmployeIlot } from "@/types/resources/AffectationEmployeIlot";

export const ResponsableFunctionField = (props: any) => (
  <FunctionField<AffectationEmployeIlot>
    source="responsable"
    render={(record) =>
      record.responsable && (
        <Chip
          label="RESPONSABLE"
          sx={{ color: "white", backgroundColor: orange[500] }}
        />
      )
    }
    {...props}
  />
);
