import api from "@/lib/axios";
import { DoctorProfileGroup, DoctorProfileResponse } from "@/types/live/doctor/profile";

export const fetchDoctorProfile = async <T,>({
    doctorID,
    group,
    signal
}: {
    doctorID: string;
    group: DoctorProfileGroup;
    signal?: AbortSignal
}): Promise<DoctorProfileResponse<T>> => {
    const { data } = await api.get(`/doctor/${doctorID}`, {
        params: { group },
        signal,
    });
    return data;
};

// If the user wants to update too
export const updateDoctorProfile = async <T,>({
    doctorID,
    group,
    payload
}: {
    doctorID: string;
    group: DoctorProfileGroup;
    payload: any
}): Promise<DoctorProfileResponse<T>> => {
    let finalPayload = payload;

    if (payload instanceof FormData) {
        if (!payload.has("group")) {
            payload.append("group", group);
        }
    } else {
        finalPayload = { ...payload, group };
    }

    const { data } = await api.post(`/doctor/${doctorID}`, finalPayload, {
        headers: {
            "Content-Type": payload instanceof FormData ? "multipart/form-data" : "application/json",
        },
    });
    return data;
};
