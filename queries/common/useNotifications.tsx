import { getNotifications } from "@/api/common/all-notifications";
import { useInfiniteQuery } from "@tanstack/react-query";

export function useInfiniteNotifications(perPage = 10) {
    return useInfiniteQuery({
        queryKey: ["notifications"],
        initialPageParam: undefined as string | undefined,
        queryFn: ({ pageParam }) => getNotifications(perPage, pageParam),
        getNextPageParam: (lastPage) => lastPage.meta.next_cursor ?? undefined,
    });
}