export interface MedicineCardProps {
    id?: number,
    patient_symptoms: string,
    doctor_name: string,
    consulated_date: string,
}

export type MedicineProps = {
    id: string | number;
    name: string;
    dose: string;
    schedule?: {
      times: string[];
      frequency?: string; 
    };
    startDate: string;
};