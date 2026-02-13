import api from "@/lib/axios";
import { UpdateInstructionsRequest, UpdateInstructionsResponse } from "@/types/doctor/instructions";

export const updateInstructions = async (
    appointmentId: string,
    data: UpdateInstructionsRequest,
    token: string
): Promise<UpdateInstructionsResponse> => {
    const response = await api.post<UpdateInstructionsResponse>(
        `/appointments/doctor-instructions/${appointmentId}`,
        data,
        {
            headers: {
                Authorization: `Bearer ${token}`,
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
