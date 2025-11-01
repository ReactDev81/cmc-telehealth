import { AppointementStatusBoxProps } from "@/types/doctor/home"

export const AppointementStatusBoxData: AppointementStatusBoxProps[] = [
    {
        id: 1,
        status: 'completed',
        status_count: 5,
    },
    {
        id: 2,
        status: 'upcoming',
        status_count: 10,
    },
    {
        id: 3,
        status: 'cancelled',
        status_count: 3,
    },
]