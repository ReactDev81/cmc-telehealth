import {
  deletePatientAccount,
  DeleteAccountResponse,
} from "@/api/patient/deleteAccount";
import { useMutation } from "@tanstack/react-query";

export const useDeleteAccount = () => {
  return useMutation<DeleteAccountResponse, any, void>({
    mutationFn: deletePatientAccount,
  });
};
