import { MedicineCardProps } from "@/types/common/my-medicines"
import { MedicineProps } from "@/types/common/my-medicines";

export const CurrentMedicinesData: MedicineCardProps[] = [
    {
        id: 1,
        patient_symptoms: 'Depression and Anxiety',
        doctor_name: 'Dr Rajeshwar',
        consulated_date: 'Sat, Feb 18',
    },
    {
        id: 2,
        patient_symptoms: 'Fever and Body Pain',
        doctor_name: 'Dr. Jubbin J Jacob',
        consulated_date: 'Sat, Mar 18',
    },
]

export const PastMedicinesData: MedicineCardProps[] = [
    {
        id: 1,
        patient_symptoms: 'Cold & Cough',
        doctor_name: 'Dr. M Joseph John',
        consulated_date: 'Sat, Jun 18',
    },
]

export const MedicinesData: MedicineProps[] = [
    {
        id: 1,
        name: "Aspirin (Oral Pill) 81",
        dose: "1 capsule, 3 times a day",
        schedule: {
            times: ["07:00", "12:00", "18:00"],
            frequency: "Daily, ongoing",
        },
        startDate: "2024-02-10 12:08",
    },
    {
        id: 2,
        name: "Niacin (Oral Pill) 50",
        dose: "1 tablet, 1 time a day",
        schedule: {
            times: ["08:00"],
            frequency: "Daily, ongoing",
        },
        startDate: "2024-02-10 12:08",
    },
    {
        id: 3,
        name: "Amoxicillin",
        dose: "1 tablet, 2 time a day",
        schedule: {
            times: ["10:00", "02:00"],
            frequency: "Daily, ongoing",
        },
        startDate: "2024-02-10 12:08",
    },
];