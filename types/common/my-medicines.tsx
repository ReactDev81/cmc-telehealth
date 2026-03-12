export interface MedicineCardProps {
    id?: number;
    prescription_id?: string;
    appointment_id?: string;
    patient_symptoms: string;
    doctor_name: string;
    consulated_date: string;
}

export type MedicineProps = {
    id: string | number;
    name?: string;
    medicine_name?: string;
    meal?: string;
    dosage?: string;
    frequency?: string;
    frequencylabel?: string;
    frequency_display?: string;
    date?: string;
    start_date?: string;
    end_date?: string;
    times?: string;
    duration_text?: string;
    instructions?: string[];
    status?: string;
    notes?: string;
    type?: string;
    dose?: string;
    schedule?: {
        times: string[];
        frequency?: string;
    };
    startDate?: string;
};
