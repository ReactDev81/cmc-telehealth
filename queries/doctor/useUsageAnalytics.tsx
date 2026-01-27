import api from "@/lib/axios"; // your axios instance
import { useQuery } from "@tanstack/react-query";

export const useUsageAnalytics = () => {
    return useQuery({
        queryKey: ["usage-analytics"],
        queryFn: async () => {
            const res = await api.get("/doctor/usage-analytics");
            return res.data.data; // returns { summary, chart_data }
        },
    });
};
