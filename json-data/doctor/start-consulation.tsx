import { MedicineProps } from "@/types/common/my-medicines";

export const prescriptionData: MedicineProps[] = [
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
];