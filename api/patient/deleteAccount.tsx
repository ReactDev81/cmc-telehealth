import api from "@/lib/axios";

export interface DeleteAccountResponse {
  success: boolean;
  message: string;
  path: string;
  timestamp: string;
  data: {
    message: string;
  };
}

export const deletePatientAccount = async (): Promise<DeleteAccountResponse> => {
  const { data } = await api.delete<DeleteAccountResponse>("/patient/account", {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return data;
};
