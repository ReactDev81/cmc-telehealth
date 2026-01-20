import api from "@/lib/axios";
import {
    PrescriptionDetailResponse,
    PrescriptionListResponse,
} from "@/types/live/patient/prescription";

export const fetchPrescriptionList = async (
    patientId: string,
    filter: string,
    { signal }: any,
): Promise<PrescriptionListResponse> => {
    const { data } = await api.get(
        `/prescriptions/${patientId}?filter=${filter}`,
        {
            signal,
        },
    );

    return data;
};

export const fetchPrescriptionDetail = async (
    appointmentId: string,
    { signal }: any,
): Promise<PrescriptionDetailResponse> => {
    const { data } = await api.get(`/prescriptions/detail/${appointmentId}`, {
        signal,
    });

    return data;
};
