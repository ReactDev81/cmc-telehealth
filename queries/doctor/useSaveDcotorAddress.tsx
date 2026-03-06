import { DoctorAddressPayload, saveDoctorAddress } from "@/api/doctor/address";
import { useMutation } from "@tanstack/react-query";

export function useSaveDoctorAddress(doctorUserID: string) {
    return useMutation({
        mutationFn: (payload: DoctorAddressPayload) =>
            saveDoctorAddress(doctorUserID, payload),
        });
}