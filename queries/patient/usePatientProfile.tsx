import api from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export const usePatientProfile = <T = any>(
    patientId: string,
    token: string,
    group: string = "personal_information",
) => {
    return useQuery<T>({
        queryKey: ["patient-profile", patientId, group],
        queryFn: async () => {
            const res = await api.get(`/patient/${patientId}/profile`, {
                params: { group },
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                },
            });

            return res.data.data as T;
        },
        enabled: !!patientId && !!token,
    });
};
