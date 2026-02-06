export interface CreateReviewPayload {
    doctor_id: string;
    title: string;
    content: string;
    rating: number;
}

export interface Review {
    id: string;
    slug: string;
    title: string;
    content: string;
    rating: number;
    doctor_id: string;
    patient_id: string;
    patient_name: string;
    patient_image: string;
    created_at: string;
}

export interface CreateReviewResponse {
    success: boolean;
    message: string;
    path: string;
    timestamp: string;
    data: Review;
}
