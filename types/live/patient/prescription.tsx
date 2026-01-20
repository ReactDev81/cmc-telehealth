export type Prescription = {
    prescription_id: string;
    appointment_id: string;
    problem: string;
    doctor_name: string;
    medician_timings: string;
};

export type PrescriptionListResponse = {
    success: boolean;
    data: Prescription[];
};

export type MedicineDetail = {
    number: number;
    prescription_id: string;
    name: string;
    frequency: string;
    frequencylabel: string;
    times: string;
    date: string;
    instructions: string[];
    status: string;
};

export type PrescriptionDetailResponse = {
    success: boolean;
    data: MedicineDetail[];
};
