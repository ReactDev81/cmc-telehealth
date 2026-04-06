import api from "@/lib/axios";
import { MyLeaveResponse } from "@/types/live/doctor/leave";

export const fetchMyLeave = async (page: number = 1, per_page: number = 5) => {

    const res = await api.get(`/leave/my`, {
        params: { page, per_page }
    });

    return res.data as MyLeaveResponse;
};