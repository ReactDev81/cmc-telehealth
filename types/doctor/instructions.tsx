export interface ConclusionReportFile {
    id: string;
    file_url: string;
    type: string;
    file_name?: string;
    report_date?: string;
    is_shared?: boolean;
}

export interface UpdateInstructionsRequest {
    instructions_by_doctor: string;
    next_visit_date: string; // YYYY-MM-DD
    report_type?: string;
    files?: any[];
    conclusion_report_files?: ConclusionReportFile[];
}

export interface UpdateInstructionsResponse {
    success: boolean;
    message: string;
    path: string;
    timestamp: string;
    data: {
        appointment_id: string;
        instructions_by_doctor: string;
        next_visit_date: string;
        report_type?: string;
        files?: any[];
        conclusion_report_files?: ConclusionReportFile[];
    };
}
