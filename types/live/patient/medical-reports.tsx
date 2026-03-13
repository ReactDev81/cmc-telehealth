export interface MedicalReport {
    id: string;
    report_name: string;
    type_label: string;
    report_date_formatted: string;
    file_url: string;
}

export interface Pagination {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
}
  
export interface MedicalReportsResponse {
    success: boolean;
    data: MedicalReport[];
    pagination: Pagination;
}  