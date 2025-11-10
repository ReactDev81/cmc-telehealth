import { PreviousAppointmentProps } from "@/types/doctor/previous-appointment"

export const PreviousAppointmentData: PreviousAppointmentProps[] = [
    {
        id: 1,
        subject: "General health checkup",
        status: "completed",
        time: "12:00 AM", 
        date: "Sat, Jul 30", 
        mode: "video"
    },
    {
        id: 2,
        subject: "X-Ray Analysis",
        status: "cancelled",
        time: "10:00 AM", 
        date: "Wed, May 14", 
        mode: "clinic"
    },
]