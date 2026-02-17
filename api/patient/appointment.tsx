import api from "@/lib/axios";

export interface AppointmentResponse {
  data: {
    id: string;
    appointment_id?: string;
    doctor_id?: string;
    status: string;
    can_reschedule: boolean;
    appointment_date: string;
    start_time: string;
    end_time: string;
    consultation_type: string;
    razorpay_key_id?: string;
    razorpay_order_id?: string;
    patient?: {
      name: string;
      age?: number;
      age_formatted: string;
      gender_formatted: string;
      allergies?: string | null;
      problem?: string;
    };
    schedule?: {
      date: string;
      time: string;
      date_formatted: string;
      time_formatted: string;
      consultation_type: string;
      consultation_type_label: string;
      opd_type?: string;
      booking_type?: string;
    };
    doctor: {
      id: string;
      user_id?: string;
      name: string;
      department: string;
      avatar?: string;
      specialization?: string;
      profile_image?: string;
      years_experience?: string;
    };
    notes?: {
      problem?: string;
      reason?: string;
    };
    payment?: {
      consultation_fee_formatted?: string;
    };
    prescriptions?: {
      notes?: string;
      doctor_name?: string;
      date?: string;
    } | null;
    medical_reports?: Array<{
      id: string;
      name: string;
      report_date: string;
      type: string;
      file_url: string;
    }>;
  };
}

export const fetchAppointmentById = async (
  id: string
): Promise<AppointmentResponse> => {
  const { data } = await api.get(`/appointments/${id}`);
  return data;
};
