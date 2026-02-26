import { getNotificationDetail, NotificationDetailResponse } from "@/api/common/notification-detail";
import { useQuery } from "@tanstack/react-query";

export function useNotificationDetail(notificationId?: string) {
    return useQuery<NotificationDetailResponse>({
        queryKey: ["notification-detail", notificationId],
        queryFn: () => getNotificationDetail(notificationId!),
        enabled: !!notificationId,
    });
}