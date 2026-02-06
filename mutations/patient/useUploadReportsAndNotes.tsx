import { uploadReportsAndNotes } from "@/api/patient/uploadReportsAndNotes";
import { UploadReportsPayload } from "@/types/live/patient/upload-reports-and-notes";
import { useMutation } from "@tanstack/react-query";

export const useUploadReportsAndNotes = (appointmentId: string) => {
    return useMutation({
        mutationFn: (payload: UploadReportsPayload) =>
            uploadReportsAndNotes(appointmentId, payload),
    });
};
