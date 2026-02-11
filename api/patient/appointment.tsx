import api from "@/lib/axios";

export interface AppointmentResponse {
  data: {
    id: string;
    doctor_id?: string;
    status: string;
    can_reschedule: boolean;
    appointment_date: string;
    start_time: string;
    end_time: string;
    consultation_type: string;
    patient?: {
      name: string;
      age_formatted: string;
      gender_formatted: string;
    };
    schedule?: {
      date: string;
      time: string;
      date_formatted: string;
      time_formatted: string;
      consultation_type: string;
      consultation_type_label: string;
      opd_type?: string;
    };
    doctor: {
      id: string;
      user_id?: string;
      name: string;
      department: string;
      avatar?: string;
      specialization?: string;
      profile_image?: string;
    };
    notes?: {
      problem?: string;
      reason?: string;
    };
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
