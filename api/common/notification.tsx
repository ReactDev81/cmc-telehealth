import api from "@/lib/axios";

export interface UnreadCountResponse {
    success: boolean;
    message: string;
    path: string;
    timestamp: string;
    data: {
      unread_count: number;
    };
}

export const getUnreadNotificationCount =
    async (): Promise<UnreadCountResponse> => {
        const { data } = await api.get(
            "/notifications/unread-count"
        );
    return data;
};