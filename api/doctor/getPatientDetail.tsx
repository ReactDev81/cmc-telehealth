import api from "@/lib/axios";
import { PatientDetailResponse } from "@/types/doctor/patient-detail";

export const getPatientDetail = async (appointmentId: string, token: string): Promise<PatientDetailResponse> => {
    try {
        // console.log("Fetching patient detail for appointmentId:", appointmentId);
        const res = await api.get(`/doctor/patient-detail/${appointmentId}`);
        // console.log("Patient detail response:", res.data);
        return res.data;
    } catch (error) {
        // console.error("Error fetching patient detail:", error);
        throw error;
    }
};
