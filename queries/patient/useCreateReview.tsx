import { createReview } from "@/api/patient/reviews";
import {
    CreateReviewPayload,
    CreateReviewResponse,
} from "@/types/live/patient/reviews";
import { useMutation } from "@tanstack/react-query";

export const useCreateReview = () => {
    return useMutation<CreateReviewResponse, Error, CreateReviewPayload>({
        mutationFn: createReview,
    });
};
