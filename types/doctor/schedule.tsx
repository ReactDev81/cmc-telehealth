export type ConsultationType = "video" | "in-person";

export interface Slot {
    id: string;
    date: string;
    start_time: string;
    end_time: string;
    time_range: string;
    consultation_type: ConsultationType;
    consultation_type_label: string;
    capacity: number;
    slot_capacity: number;
    booked_count: number;
    available_slots: number;
    is_recurring: boolean;
    doctor_room: string | null;
}

export interface ScheduleData {
    date: string;
    day_name: string;
    slots: Slot[];
}

export interface ScheduleResponse {
    status: boolean;
    message: string;
    path: string;
    timestamp: string;
    data: ScheduleData;
}