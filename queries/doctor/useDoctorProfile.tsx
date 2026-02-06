import { fetchDoctorProfile } from "@/api/doctor/profile";
import { DoctorProfileGroup } from "@/types/live/doctor/profile";
import { useQuery } from "@tanstack/react-query";

export function useDoctorProfile<T>(doctorID: string, group: DoctorProfileGroup, enabled: boolean = true) {
    return useQuery({
        queryKey: ["doctor-profile", doctorID, group],
        queryFn: ({ signal }) => fetchDoctorProfile<T>({ doctorID, group, signal }),
        enabled: !!doctorID && enabled,
        staleTime: 5 * 60 * 1000,
    });
}
