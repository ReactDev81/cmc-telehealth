export interface UpdateInstructionsRequest {
    instructions_by_doctor: string;
    next_visit_date: string; // YYYY-MM-DD
}

export interface UpdateInstructionsResponse {
    status: boolean;
    message: string;
    path: string;
    timestamp: string;
    data: {
        appointment_id: string;
        instructions_by_doctor: string;
        next_visit_date: string;
    };
}
