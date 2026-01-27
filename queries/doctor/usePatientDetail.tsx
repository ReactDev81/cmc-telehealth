import { getPatientDetail } from "@/api/doctor/getPatientDetail";
import { PatientDetailResponse } from "@/types/doctor/patient-detail";
import { useQuery } from "@tanstack/react-query";

export const usePatientDetail = (appointmentId: string, token: string) => {
    return useQuery<PatientDetailResponse>({
        queryKey: ["patient-detail", appointmentId],
        queryFn: () => getPatientDetail(appointmentId, token),
        enabled: !!appointmentId && !!token,
    });
};
