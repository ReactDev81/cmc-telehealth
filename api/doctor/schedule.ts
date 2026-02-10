import api from "@/lib/axios";
import { ScheduleData } from "@/types/doctor/schedule";

export const fetchDoctorSchedule = async ({
    date,
    filter,
    signal
}: {
    date: string;
    filter: string;
    token?: string; // Kept for compatibility but unused
    signal?: AbortSignal
}): Promise<ScheduleData> => {
    const res = await api.get(`/doctor/schedule`, {
        params: {
            filter: filter,
            date: date
        },
        signal,
    });
    // console.log("[API] Schedule raw response:", JSON.stringify(res.data, null, 2));
    return res.data.data;
};
