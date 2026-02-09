import api from "@/lib/axios";

export interface PatientAddressPayload {
  address: string;
  area: string;
  pincode: string;
  city: string;
  state: string;
  group: "address";
}

export const savePatientAddress = async (
  patientId: string,
  payload: PatientAddressPayload
) => {
  const { data } = await api.post(
    `/patient/${patientId}`,
    payload
  );

  return data;
};