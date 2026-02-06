export interface TestimonialItem {
    id: string;
    slug: string;
    patient_name: string;
    patient_image: string;
    patient_age: number;
    patient_location: string;
    title: string;
    content: string;
    rating: number;
    total_reviews: number;
    doctor_name: string;
    doctor_avatar: string;
    rating_stars: string;
    created_at: string;
}

export interface PaginationInfo {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
}

export interface AllTestimonialsResponse {
    status: boolean;
    message: string;
    pagination: PaginationInfo;
    data: TestimonialItem[];
}
