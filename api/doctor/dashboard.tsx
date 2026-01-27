import api from "@/lib/axios";
import { DoctorDashboardResponse } from "@/types/live/doctor/dashboard";

export const fetchDoctorDashboard = async (token: string): Promise<DoctorDashboardResponse> => {
  const res = await api.get("/doctor/home", {
    headers: { Authorization: `Bearer ${token}` },
  });

  return res.data.data;
};
