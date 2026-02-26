// import { CreateReviewPayload, CreateReviewResponse } from "@/types/live/patient/reviews";
// import axios from "../../lib/axios";

// export const createReview = async (
//     payload: CreateReviewPayload
// ): Promise<CreateReviewResponse> => {
//     const formData = new FormData();
//     const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

//     formData.append("doctor_id", payload.doctor_id);
//     formData.append("title", payload.title);
//     formData.append("content", payload.content);
//     formData.append("rating", String(payload.rating));

//     const response = await axios.post(
//         `${API_BASE_URL}/reviews`,
//         formData,
//         {
//             headers: {
//                 Authorization: `Bearer ${process.env.EXPO_PUBLIC_token}`,
//                 Accept: "application/json",
//                 // "Content-Type": "multipart/form-data",
//             },
//         }
//     );

//     return response.data;
// };



import {
    CreateReviewPayload,
    CreateReviewResponse,
} from "@/types/live/patient/reviews";
import api from "../../lib/axios";

export const createReview = async (
    payload: CreateReviewPayload
): Promise<CreateReviewResponse> => {
    const formData = new FormData();

    if (payload.appointment_id) {
        formData.append("appointment_id", payload.appointment_id);
    }
    formData.append("doctor_id", payload.doctor_id);
    formData.append("title", payload.title);
    formData.append("content", payload.content);
    formData.append("rating", String(payload.rating));

    try {
        const response = await api.post(
            "/reviews",
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );
        return response.data;
    } catch (error: any) {
        // console.error("createReview error:", error?.message);
        throw error;
    }
};