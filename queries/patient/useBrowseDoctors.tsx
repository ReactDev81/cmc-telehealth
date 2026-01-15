import { fetchBrowseDoctors } from "@/api/patient/browseDoctors";
import { useQuery } from "@tanstack/react-query";

export const useBrowseDoctors = (enabled: boolean) => {
  return useQuery({
    queryKey: ["browse-doctors"],
    queryFn: fetchBrowseDoctors,
    enabled,
    staleTime: 5 * 60 * 1000, // cache for 5 min
    retry: 0,                 // mobile-safe
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};