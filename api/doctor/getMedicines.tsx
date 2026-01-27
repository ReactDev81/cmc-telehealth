import api from "@/lib/axios";

export const getMedicines = async (token: string, searchQuery?: string) => {
    const params = searchQuery ? { search: searchQuery } : {};

    console.log("🔍 Searching medicines with query:", searchQuery);
    console.log("📤 API params:", params);

    const res = await api.get("/doctor/medicines", {
        headers: { Authorization: `Bearer ${token}` },
        params,
    });

    console.log("📥 API Response:", res.data);

    // Convert numbered keys to array
    const response = res.data;
    const medicines = Object.keys(response)
        .filter(key => !isNaN(Number(key))) // Get only numeric keys (0, 1, 2, etc.)
        .map(key => response[key]);

    console.log("✅ Parsed medicines:", medicines);
    console.log("📊 Total medicines found:", medicines.length);

    return medicines;
};
