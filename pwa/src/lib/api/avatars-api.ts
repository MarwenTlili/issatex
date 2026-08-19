import { getSession } from "next-auth/react";
import { ENTRYPOINT } from "@/config/api";
import type { Avatar } from "@/types/resources/Avatar";
import { ForbiddenException } from "./exceptions";

/**
 * Upload avatar to the server
 */
export const uploadAvatar = async (file: File): Promise<Avatar> => {
  const session = await getSession();

  if (!session?.accessToken) {
    throw new ForbiddenException({
      status: 403,
      title: "Forbidden",
      detail: "You do not have permission to access this resource.",
    });
  }

  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${ENTRYPOINT}/api/avatars`, {
    method: "POST",
    body: formData,
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to upload avatar");
  }

  return response.json();
};
