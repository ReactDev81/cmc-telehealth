import { fetchDoctorSchedule } from "@/api/doctor/schedule";
import { useQuery } from "@tanstack/react-query";

export const useGetDoctorSchedule = (date: string, filter: string, token: string) => {
    return useQuery({
        queryKey: ["doctor-schedule", date, filter, token],
        queryFn: ({ signal }) => fetchDoctorSchedule({ date, filter, token, signal }),
        enabled: !!date && !!filter && !!token,
    });
};