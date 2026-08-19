import { useMutation } from "@tanstack/react-query";

import { RegisterClient } from "@/types/resources/RegisterClient";
import { RegistrationFormData } from "@/lib/validation/schemas";
import { authService } from "@/lib/auth/auth-service";

export const useRegisterClient = () => {
  return useMutation<RegisterClient, Error, RegistrationFormData>({
    mutationFn: async (formData: RegistrationFormData) => {
      return authService.registerClient(formData);
    },
  });
};
