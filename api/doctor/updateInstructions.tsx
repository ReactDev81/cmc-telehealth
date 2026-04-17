import api from "@/lib/axios";
import { UpdateInstructionsRequest, UpdateInstructionsResponse } from "@/types/doctor/instructions";

export const updateInstructions = async (
    appointmentId: string,
    data: UpdateInstructionsRequest,
    token: string
): Promise<UpdateInstructionsResponse> => {
    const formData = new FormData();
    formData.append("instructions_by_doctor", data.instructions_by_doctor);
    formData.append("next_visit_date", data.next_visit_date);
    
    if (data.report_type) {
        formData.append("type", data.report_type);
    }

    if (data.files && data.files.length > 0) {
        data.files.forEach((file) => {
            // @ts-ignore
            formData.append("files[]", {
                uri: file.uri,
                name: file.name,
                type: file.mimeType || file.type || "application/octet-stream",
            });
        });
    }

    const response = await api.post<UpdateInstructionsResponse>(
        `/appointments/doctor-instructions/${appointmentId}`,
        formData,
        {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
            },
        }
    );
    return response.data;
};

export const fetchInstructions = async (
    appointmentId: string,
    token: string
): Promise<UpdateInstructionsResponse> => {
    const response = await api.get<UpdateInstructionsResponse>(
        `/appointments/doctor-instructions/${appointmentId}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
    return response.data;
};
