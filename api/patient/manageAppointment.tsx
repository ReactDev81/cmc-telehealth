import api from "@/lib/axios";

export interface ManageAppointmentPayload {
  notes: string;
  file?: {
    uri: string;
    type: string;
    name: string;
  };
}

export const manageAppointment = async (
  appointmentId: string,
  payload: FormData
) => {
  const { data } = await api.post(
    `/appointments/${appointmentId}/update-information`,
    payload,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return data;
};
