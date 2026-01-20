import { fetchPrescriptionList } from "@/api/patient/prescriptions";
import { getAuthToken } from "@/lib/authToken";
import { useQuery } from "@tanstack/react-query";

export const usePrescriptions = (
    patientId?: string,
    filter: string = "current",
) => {
    const token = getAuthToken();

    return useQuery({
        queryKey: ["prescriptions", patientId, filter],
        queryFn: ({ signal }) =>
            fetchPrescriptionList(patientId as string, filter, { signal }),
        enabled: !!token && !!patientId,
        retry: 0,
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    });
};
