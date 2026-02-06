import api from "@/lib/axios";
import {
    UploadReportsPayload,
    UploadReportsResponse,
} from "../../types/live/patient/upload-reports-and-notes";

/**
 * Upload reports & notes for an appointment
 */
export const uploadReportsAndNotes = async (
    appointmentId: string,
    payload: UploadReportsPayload
): Promise<UploadReportsResponse> => {
    const formData = new FormData();

    // Notes
    if (payload.notes?.trim()) {
        formData.append("notes", payload.notes.trim());
    }

    // Reports
    payload.reports?.forEach((report, index) => {
        formData.append(`reports[${index}][type]`, report.type);

        formData.append(`reports[${index}][file]`, {
            uri: report.file.uri,
            name: report.file.name,
            type: report.file.type,
        } as any);
    });

    const { data } = await api.post(
        `/appointments/${appointmentId}/update-information`,
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );

    return data;
};
