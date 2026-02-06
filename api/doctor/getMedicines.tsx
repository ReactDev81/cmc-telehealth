import api from "@/lib/axios";

export interface Medicine {
    id: string;
    name: string;
    type: string;
    dosage?: string;
    description?: string;
}

export interface MedicinesResponse {
    status: boolean;
    message: string;
    data: Medicine[] | null;
    [key: string]: any; // For indexed keys like "0", "1", "2"
}

export const getMedicines = async (
    token: string,
    searchQuery: string = ""
): Promise<Medicine[]> => {
    try {
        if (!token) {
            // console.warn("No token provided for getMedicines");
            return [];
        }

        const config: any = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };

        if (searchQuery && searchQuery.trim()) {
            config.params = { search: searchQuery.trim() };
        }

        // Full endpoint: https://stagetelehealth.cmcludhiana.in/api/v2/doctor/medicines
        // console.log("Fetching medicines with token and search:", { searchQuery, hasToken: !!token });
        const response = await api.get<MedicinesResponse>("/doctor/medicines", config);

        // console.log("Raw response:", response.data);

        // Try to extract medicines from the response
        let medicines: Medicine[] = [];

        // First, try to get from response.data.data if it's an array
        if (response.data?.data && Array.isArray(response.data.data)) {
            medicines = response.data.data;
            // console.log("Got medicines from data array:", medicines.length);
        }
        // Second, try to get from indexed keys (0, 1, 2, etc.)
        else if (response.data) {
            Object.keys(response.data).forEach((key) => {
                // Skip non-numeric keys like "status", "message", "path", "timestamp", "data"
                if (/^\d+$/.test(key)) {
                    const medicine = response.data[key];
                    if (medicine && medicine.id && medicine.name) {
                        medicines.push(medicine);
                    }
                }
            });
            // console.log("Got medicines from indexed keys:", medicines.length);
        }

        // console.log("Successfully fetched medicines:", medicines.length);
        return medicines;
    } catch (error) {
        // console.error("Error fetching medicines:", error);
        throw error;
    }
};