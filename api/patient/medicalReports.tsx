import api from "@/lib/axios";

export interface UploadMedicalReportPayload {
    patientId: string;
    name: string;
    type?: string;
    report_date: Date;
    is_public?: number;
    file: {
        uri: string;
        name: string;
        mimeType?: string;
        type?: string;
        size?: number
    };
}

export const uploadMedicalReport = async ( payload: UploadMedicalReportPayload ) => {

    const formData = new FormData();

    const reportDateString =
        payload.report_date instanceof Date
        ? payload.report_date.toISOString()
        : payload.report_date;

    const filePart = {
        uri: payload.file.uri,
        name: payload.file.name,
        size: payload.file.size,
        mimeType: payload.file.mimeType || payload.file.type || "application/octet-stream",
    };
  
    formData.append("name", payload.name);
    formData.append("type", payload.type ?? "");
    formData.append("report_date", reportDateString);
    formData.append("is_public", String(payload.is_public ?? 0));
    formData.append("file", filePart as any);

    const response = await api.post(
        `/patient/${payload.patientId}/medical-reports`,
        formData
    );
    
    return response.data;
};