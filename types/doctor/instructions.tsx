export interface UpdateInstructionsRequest {
    instructions_by_doctor: string;
    next_visit_date: string; // YYYY-MM-DD
    files?: any[];
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
    };
}
