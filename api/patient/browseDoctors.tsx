import api from "@/lib/axios";
import { AvailableDoctorsProps } from "@/types/live/patient/home";

export interface BrowseDoctorsResponse {
  data: AvailableDoctorsProps[];
}

export const fetchBrowseDoctors = async (): Promise<BrowseDoctorsResponse> => {
  const { data } = await api.get("/patient/browse-doctors");
  return data;
};