import api from "@/lib/axios";
import { Appointment } from "@/types/doctor/appointment";

export const fetchAppointments = async (
  filter: "today" | "upcoming" | "past",
  token: string
): Promise<Appointment[]> => {
  // console.log(`[API] Fetching ${filter} appointments from /appointments/my...`);
  try {
    const res = await api.get<any>(
      `/appointments/my?filter=${filter}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log(`[API] /appointments/my ${filter} keys:`, Object.keys(res.data));
    if (res.data.pagination) {
      console.log(`[API] /appointments/my ${filter} total:`, res.data.pagination.total);
    }

    console.log(`[API] /appointments/my ${filter} response:`, JSON.stringify(res.data, null, 2));

    const extract = (obj: any): Appointment[] => {
      if (!obj) return [];

      // If the object itself is an array, return it
      if (Array.isArray(obj)) return obj;

      // Check common data keys
      const dataKeys = ["data", "list", "items", "appointments"];
      for (const key of dataKeys) {
        if (obj[key] && Array.isArray(obj[key])) {
          // console.log(`[API] Found array in key: ${key}, length: ${obj[key].length}`);
          return obj[key];
        }
      }

      // Check if data is nested under data.data (happens in some responses)
      if (obj.data && typeof obj.data === 'object' && obj.data.data && Array.isArray(obj.data.data)) {
        return obj.data.data;
      }

      // Recursive search for an array if not found in common keys
      for (const key in obj) {
        if (obj[key] && typeof obj[key] === "object" && !Array.isArray(obj[key])) {
          const nested = extract(obj[key]);
          if (nested.length > 0) return nested;
        }
      }

      return [];
    };

    const finalData = extract(res.data);
    // console.log(`[API] Extracted ${finalData.length} ${filter} appointments`);
    return finalData;
  } catch (error: any) {
    if (error.response) {
      console.error(`[API] ${error.response.status} error fetching ${filter} appointments:`, JSON.stringify(error.response.data, null, 2));
    } else {
      console.error(`[API] Error fetching ${filter} appointments:`, error.message);
    }
    return [];
  }
};
