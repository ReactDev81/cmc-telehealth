export interface Appointment {
    id: string;
    date: string;
    time: string;
    status: string;
}

export interface PatientDetail {
    id: string;
    name: string;
    age: number;
    gender_label: string;
    avatar: string;
    contact: { phone: string; email: string };
    upcoming_appointments: Appointment[];
    previous_appointments: Appointment[];
}
