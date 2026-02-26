import api from "@/lib/axios";

export interface NotificationDetailResponse {
    success: boolean;
    message: string;
    path: string;
    timestamp: string;
    data: {
        id: string;
        group: string;
        event_type: string;
        title: string;
        message: string;
        entity: {
            type: string;
            id: string;
        };
        data: {
            display_name: string;
            role: string;
        };
    };
}

export const getNotificationDetail = async ( notificationId: string ): Promise<NotificationDetailResponse> => {
    const { data } = await api.get(
        `/notifications/${notificationId}`
    );
    return data;
};