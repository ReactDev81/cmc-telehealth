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

export const uploadMedicalReport = async (payload: UploadMedicalReportPayload) => {


    /*
    /* console.log("UPLOAD PAYLOAD RECEIVED", {
        patientId: payload.patientId,
        name: payload.name,
        report_type_id: payload.report_type_id,
        is_public: payload.is_public,
        file: payload.file,
    }); */
    */

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
    // formData.append("file", filePart as any);

    formData.append("file", {
        uri: payload.file.uri,
        name: payload.file.name,
        type: payload.file.mimeType || payload.file.type || "image/jpeg",
    } as any);

    // Try both singular and plural patient routes if server differs
    const candidates = [
        `/patient/${payload.patientId}/medical-reports`,
        `/patients/${payload.patientId}/medical-reports`,
    ];

    let lastError: any = null;
    for (let i = 0; i < candidates.length; i++) {
        const url = candidates[i];
        try {
            // console.log(`[api/uploadMedicalReport] POST ${url}`);
            const response = await api.post(url, formData);
            // console.log(`[api/uploadMedicalReport] Success ${url}`, response.data);
            return response.data;
        } catch (err: any) {
            lastError = err;
            const status = err?.response?.status;
            // console.log(`[api/uploadMedicalReport] Error ${url} status=${status}`, err?.response?.data || err.message);
            if (status !== 404) throw err;
        }
    }

    throw lastError;
};