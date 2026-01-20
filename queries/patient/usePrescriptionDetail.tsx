import { fetchPrescriptionDetail } from "@/api/patient/prescriptions";
import { getAuthToken } from "@/lib/authToken";
import { useQuery } from "@tanstack/react-query";

export const usePrescriptionDetail = (appointmentId?: string) => {
    const token = getAuthToken();

    return useQuery({
        queryKey: ["prescriptionDetail", appointmentId],
        queryFn: ({ signal }) =>
            fetchPrescriptionDetail(appointmentId as string, { signal }),
        enabled: !!token && !!appointmentId,
        retry: 0,
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    });
};
