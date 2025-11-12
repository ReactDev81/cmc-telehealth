export type UserRole = 'patient' | 'doctor';

export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
}