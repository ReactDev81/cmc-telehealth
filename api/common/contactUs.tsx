// import api from "@/lib/axios";
// import { ContactUsPayload, ContactUsResponse } from "../../types/live/common/contact-us";

// export const contactUs = async (
//     payload: ContactUsPayload
// ): Promise<ContactUsResponse> => {
//     const formData = new FormData();

//     formData.append("first_name", payload.first_name);
//     formData.append("last_name", payload.last_name);
//     formData.append("email", payload.email);
//     formData.append("message", payload.message);

//     if (payload.user_id) {
//         formData.append("user_id", payload.user_id);
//     }

//     const { data } = await api.post(
//         "/contact-us",
//         formData,
//         // {
//         //     headers: {
//         //         Accept: "application/json",
//         //     },
//         // }
//     );

//     return data;
// };



import api from "@/lib/axios";
import { ContactUsPayload, ContactUsResponse } from "../../types/live/common/contact-us";

export const contactUs = async (
    payload: ContactUsPayload
): Promise<ContactUsResponse> => {
    const formData = new FormData();

    formData.append("first_name", payload.first_name);
    formData.append("last_name", payload.last_name);
    formData.append("email", payload.email);
    formData.append("message", payload.message);

    if (payload.user_id) {
        formData.append("user_id", payload.user_id);
    }

    const { data } = await api.post(
        "/contact-us",
        formData,
        {
            headers: {
                Accept: "application/json",
                "Content-Type": "multipart/form-data",
            },
        }
    );

    return data;
};
