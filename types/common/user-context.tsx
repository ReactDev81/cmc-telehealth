export type UserRole = 'patient' | 'doctor';

export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    avatar?: string;
    patient_id?: string;
    doctor_id?: string;
    gender: string,
    date_of_birth: string,
    phone: string,
}