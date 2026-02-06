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
    name: string;
    dosage?: string;
    frequency?: string;
    frequencylabel?: string;
    date?: string;
    start_date?: string;
    end_date?: string;
    times?: string;
    instructions?: string[];
    status?: string;
    notes?: string;
    type?: string;

    // Legacy/Optional props from previous implementation if needed for other components
    dose?: string;
    schedule?: {
        times: string[];
        frequency?: string;
    };
    startDate?: string;
};
