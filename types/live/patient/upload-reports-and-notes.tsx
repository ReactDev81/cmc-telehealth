export interface UploadReportFile {
    uri: string;
    name: string;
    type: string;
}

export interface UploadReportItem {
    type: string;
    file: UploadReportFile;
}

export interface UploadReportsPayload {
    notes?: string;
    reports?: UploadReportItem[];
}

/* ---------- RESPONSE ---------- */

export interface MedicalReport {
    id: string;
    name: string;
    type: string;
    report_date: string;
    file_url: string;
    status: string;
}

export interface UploadReportsResponse {
    status: boolean;
    message: string;
    path: string;
    timestamp: string;
    data: {
        message: string;
        appointment_id: string;
        doctor_id: string;
        notes: {
            problem: string;
        };
        medical_reports: MedicalReport[];
    };
}
