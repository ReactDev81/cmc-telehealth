import { getAuthToken } from "@/lib/authToken";
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
  payload: FormData | UpdatePatientProfilePayload,
): Promise<UpdatePatientProfileResponse> => {
  // For FormData with file upload, use native fetch (axios has issues with FormData in React Native)
  if (payload instanceof FormData) {
    const token = getAuthToken();
    const baseURL = process.env.EXPO_PUBLIC_API_BASE_URL;

    try {
      const response = await fetch(`${baseURL}/patient/${patientId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          // Do NOT set Content-Type - FormData will set it automatically with boundary
        },
        body: payload,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error: any) {
      // console.log("❌ FormData fetch error:", error.message || error);
      throw error;
    }
  }

  // For regular JSON payload, use axios
  const { data } = await api.post(`/patient/${patientId}`, payload);
  return data;
};
