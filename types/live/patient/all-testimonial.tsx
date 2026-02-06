/* Single Review */
export interface ReviewItem {
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

/* Pagination */
export interface Pagination {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
}

/* API Response */
export interface AllReviewsResponse {
    status: boolean;
    message: string;
    pagination: Pagination;
    path: string;
    timestamp: string;
    data: ReviewItem[];
}
