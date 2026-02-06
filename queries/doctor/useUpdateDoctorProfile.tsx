import { updateDoctorProfile } from "@/api/doctor/profile";
import { DoctorProfileGroup } from "@/types/live/doctor/profile";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUpdateDoctorProfile(doctorID: string, group: DoctorProfileGroup) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: any) => updateDoctorProfile({ doctorID, group, payload }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["doctor-profile", doctorID, group] });
        },
    });
}
