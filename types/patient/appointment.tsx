import { ImageSourcePropType } from "react-native";

export interface appointmentProps {
  appointment_id?: string;
  status?: string;
  image?: ImageSourcePropType;
  consultation_type?: string;
  consultation_fee?: string;
  name?: string;
  speciality?: string;
  rating?: number;
  experience?: string;
  years_experience?: string;
  date?: string;
  time?: string;
  average_rating?: number;
  call_now?: boolean;
  join_url?: string;
}

export type Appointment = {
  appointment_id: string;
  slug: string;
  status: string;
  status_label: string;
  can_start_consultation: boolean;
  can_cancel: boolean;
  can_reschedule: boolean;
  appointment_date: string;
  appointment_date_formatted: string;
  appointment_time: string;
  appointment_time_formatted: string;
  consultation_type: "video" | "in-person";
  consultation_type_label: string;
  fee_amount: string;
  ratings_count: number;
  average_rating?: number;

  // Optional live-consultation fields
  call_now?: boolean;
  join_url?: string;
  video_consultation?: {
    join_url: string;
  };

  schedule: {
    date: string;
    date_formatted: string;
    time: string;
    time_formatted: string;
    booking_type: string;
    consultation_type: "video" | "in-person";
    consultation_type_label: string;
  };

  doctor?: {
    id: string;
    name: string;
    avatar: ImageSourcePropType | null;
    department: string;
    slug: string;
    average_rating?: number;
    years_experience?: string;
  };
};

export type AppointmentListResponse = {
  status: boolean;
  data: Appointment[];
};
