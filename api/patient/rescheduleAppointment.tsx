import api from "@/lib/axios";

export interface RescheduleAppointmentPayload {
    doctor_id: string;
    availability_id: string;
    appointment_date: string;
    appointment_time: string;
    consultation_type: "video" | "in-person";
    opd_type: "general" | "private" | null;
    consultation_fee: string;
    appointment_id: string;
}

export interface ScheduleData {
    date: string;
    date_formatted: string;
    time: string;
    time_formatted: string;
    booking_type: string;
    consultation_type: string;
    consultation_type_label: string;
}

export interface PatientData {
    id: string;
    name: string;
    first_name: string;
    last_name: string;
    age: number;
    age_formatted: string;
    gender: string;
    gender_formatted: string;
    avatar: string;
    phone: string;
    email: string;
    blood_group: string;
    allergies: string | null;
    problem: string;
    symptoms: string[];
    slug: string;
}

export interface DoctorData {
    id: string;
    name: string;
    first_name: string;
    last_name: string;
    avatar: string;
    years_experience: string;
    department: string;
    slug: string;
}

export interface PaymentData {
    id: string;
    order_id: string;
    payment_id: string;
    key_id: string | null;
    consultation_fee: number;
    consultation_fee_formatted: string;
    admin_fee: string;
    admin_fee_formatted: string;
    discount: number;
    discount_formatted: string;
    total: number;
    total_formatted: string;
    status: string;
    payment_method: string;
    transaction_id: string;
}

export interface NotesData {
    reason: string;
    problem: string;
}

export interface RescheduleAppointmentResponseData {
    appointment_id: string;
    slug: string;
    schedule: ScheduleData;
    status: string;
    status_label: string;
    can_start_consultation: boolean;
    can_cancel: boolean;
    can_reschedule: boolean;
    patient: PatientData;
    doctor: DoctorData;
    razorpay_key_id: string;
    razorpay_order_id: string;
    payment: PaymentData;
    notes: NotesData;
}

export interface RescheduleAppointmentResponse {
    success: boolean;
    message: string;
    data: RescheduleAppointmentResponseData;
    fee_changed: boolean;
    old_fee: string;
    new_fee: number;
}

export const rescheduleAppointment = async (
    appointmentId: string,
    payload: RescheduleAppointmentPayload
): Promise<RescheduleAppointmentResponse> => {
    const { data } = await api.post(
        `/appointments/reschedule`,
        payload
    );
    return data;
};
