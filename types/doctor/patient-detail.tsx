export interface PatientDetailResponse {
    status: boolean;
    message: string;
    id: string;
    slug: string;
    first_name: string;
    last_name: string;
    name: string;
    gender: string;
    gender_label: string;
    date_of_birth: string;
    age: number;
    age_display: string;
    avatar: string;
    problem: string;
    contact: {
        phone: string;
        phone_formatted: string;
        alternate_phone: string | null;
        email: string;
    };
    address: {
        address: string;
        area: string;
        city: string;
        state: string;
        pincode: string;
        nationality: string;
    };
    blood_group: string;
    marital_status: string;
    father_name: string;
    mother_name: string;
    upcoming_appointments: PatientAppointment[];
    previous_appointments: PatientAppointment[];
    medical_reports: MedicalReport[];
    current_medications: Medication[];
    path: string;
    timestamp: string;
    data: any;
}

export interface PatientAppointment {
    appointment_id: string;
    slug: string;
    appointment_date: string;
    appointment_date_formatted: string;
    appointment_time: string;
    appointment_time_formatted: string;
    appointment_end_time: string;
    appointment_end_time_formatted: string;
    consultation_type: string;
    consultation_type_label: string;
    status: string;
    status_label: string;
    fee_amount: string;
    notes: {
        problem?: string;
    } | null;
    call_now: boolean;
    video_consultation?: {
        id: string;
        room_id: string;
        status: string;
        join_url: string;
        can_join: boolean;
        started_at: string;
        ended_at: string;
    };
}

export interface MedicalReport {
    id: string;
    report_name: string;
    type_label: string;
    report_date_formatted: string;
    file_url: string;
}

export interface Medication {
    id: string;
    name: string;
    dosage: string;
    frequency: string;
    start_date: string;
    duration?: string;
}
