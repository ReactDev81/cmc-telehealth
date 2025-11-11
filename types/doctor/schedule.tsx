export type VisitType = "In Person" | "Video Call";

export type Slot = {
    id: string;
    start: string;  
    end: string;     
    capacity: number;
    label: VisitType;
};