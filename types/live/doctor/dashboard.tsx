export interface Appointment {
    id: string;
    patient_name: string;
    patient_image: string;
    time: string;
    date?: string;
    consultation_type: "video" | "in-person";
    status: string;
    ready_to_join?: boolean;
    video_consultation?: any;
  }
  
  export interface Summary {
    todays_appointments: number;
    upcoming_appointments: number;
    cancelled_appointments: number;
  }
  
  export interface Review {
    id: string;
    slug: string;
    patient_name: string;
    patient_image: string;
    patient_age: number | null;
    patient_location: string | null;
    title: string;
    content: string;
    rating: number;
    total_reviews: number;
    doctor_name: string;
    doctor_avatar: string;
    rating_stars: string;
    created_at: string;
  }
  
  export interface DoctorDashboardResponse {
    summary: Summary;
    todays_appointments: Appointment[];
    upcoming_appointments: Appointment[];
    doctor_reviews: Review[];
  }
  