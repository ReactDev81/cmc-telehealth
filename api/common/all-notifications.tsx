import api from "@/lib/axios";

export interface NotificationItem {
    id: string;
    title: string;
    desc: string;
    is_read: boolean;
    created_at: string;
    group: string;
}
  
export interface NotificationsResponse {
    data: NotificationItem[];
    links: {
        first: string | null;
        last: string | null;
        prev: string | null;
        next: string | null;
    };
    meta: {
        path: string;
        per_page: number;
        next_cursor: string | null;
        prev_cursor: string | null;
        current_user_id: string;
        total_unread: number;
    };
}

export const getNotifications = async ( perPage = 10, cursor?: string ): Promise<NotificationsResponse> => {
    const { data } = await api.get("/notifications", {
        params: {
            per_page: perPage,
            cursor,
        },
    });
    return data;
};