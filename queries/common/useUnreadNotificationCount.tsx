import { getUnreadNotificationCount, UnreadCountResponse } from "@/api/common/notification";
import { useQuery } from "@tanstack/react-query";

export function useUnreadNotificationCount() {
  return useQuery<UnreadCountResponse>({
    queryKey: ["unread-notification-count"],
    queryFn: getUnreadNotificationCount,
    refetchOnWindowFocus: true, // optional
  });
}