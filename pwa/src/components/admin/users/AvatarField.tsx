import { Avatar } from "@mui/material";
import { Person } from "@mui/icons-material";

type AvatarFieldProps = {
  size?: number;
  record: any;
};

const AvatarField = ({ size = 40, record }: AvatarFieldProps) => {
  const hasAvatar = record?.avatar?.contentUrl;

  return (
    <Avatar
      alt={record?.username || "User"}
      src={hasAvatar ? record.avatar.contentUrl : undefined}
      sx={{
        width: size,
        height: size,
        backgroundColor: hasAvatar ? undefined : "primary.light",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        transition: "transform 0.2s ease",
        "&:hover": {
          transform: "scale(1.05)",
        },
      }}
    >
      {!hasAvatar && <Person />}
    </Avatar>
  );
};

export default AvatarField;
