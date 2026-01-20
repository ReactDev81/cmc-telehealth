export interface MedicalReport {
    id: string;
    report_name: string;
    type_label: string;
    report_date_formatted: string;
    file_url: string;
}
  
export interface MedicalReportsResponse {
    success: boolean;
    data: MedicalReport[];
}  