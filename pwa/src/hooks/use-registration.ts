import { useMutation } from "@tanstack/react-query";
import { publicApiRequest } from "@/lib/api/base";
import { API_ENDPOINTS } from "@/config/api";
import { RegistrationFormData } from "@/lib/validation/schemas";

export type RegisterClientResponse = {
  success: boolean;
  message: string;
  userId: number;
  clientId: number;
};

export const useRegisterClient = () => {
  return useMutation<RegisterClientResponse, Error, RegistrationFormData>({
    mutationFn: async (formData: RegistrationFormData) => {
      return await publicApiRequest<RegisterClientResponse>(
        API_ENDPOINTS.REGISTER_CLIENT,
        {
          method: "POST",
          body: JSON.stringify(formData),
        },
      );
    },
  });
};
