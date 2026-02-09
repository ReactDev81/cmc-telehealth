import api from "@/lib/axios";

export interface PatientAddress {
  address: string;
  area: string;
  pincode: string;
  city: string;
  state: string;
}

export interface PatientAddressResponse {
  status: boolean;
  message: string;
  group: "address";
  path: string;
  timestamp: string;
  data: PatientAddress;
}

export const fetchPatientAddress = async (
    patientId: string
  ): Promise<PatientAddressResponse> => {
    const { data } = await api.get(
      `/patient/${patientId}/profile`,
      {
        params: { group: "address" },
      }
    );
  
    return data;
};  