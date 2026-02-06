import { contactUs } from "@/api/common/contactUs";
import { useMutation } from "@tanstack/react-query";
import { ContactUsPayload } from "../../types/live/common/contact-us";

export const useContactUs = () => {
    return useMutation({
        mutationFn: (payload: ContactUsPayload) => contactUs(payload),
    });
};
