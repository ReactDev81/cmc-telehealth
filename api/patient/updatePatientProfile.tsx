import api from "@/lib/axios";

export interface UpdatePatientProfilePayload {
  first_name: string;
  last_name: string;
  mobile_no: string;
  date_of_birth: string;
  gender: "male" | "female" | "other";
  group: "personal_information";
}

export interface UpdatePatientProfileResponse {
  status: boolean;
  message: string;
  group: string;
  data: null;
}

export const updatePatientProfile = async (
  patientId: string,
  payload: UpdatePatientProfilePayload,
): Promise<UpdatePatientProfileResponse> => {
  const { data } = await api.post(`/patient/${patientId}`, payload);
  return data;
};
