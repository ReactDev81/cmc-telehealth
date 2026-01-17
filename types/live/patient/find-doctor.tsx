export interface DepartmentSymptomItem {
    id: number;
    department: {
        name: string;
        icon: string;
    };
    symptoms: Array<{
        name: string;
        icon: string;
    }>;
}

export interface DepartmentSymptomResponse {
    data: DepartmentSymptomItem[];
}