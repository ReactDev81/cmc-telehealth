import MyLeavesCard from "@/components/doctor/profile/my-leaves-card";
import Button from "@/components/ui/Button";
import ErrorState from "@/components/ui/ErrorState";
import Pagination from "@/components/ui/Pagination";
import { useMyLeave } from "@/queries/doctor/useMyLeave";
import { useIsFocused } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import ApplyLeaveModal from "./apply-leave";

const MyLeaves = () => {

    const [applyLeaveVisible, setApplyLeaveVisible] = useState(false);
    const [page, setPage] = useState(1);
    const perPage = 5;
    const { data, isLoading, error, isError, refetch } = useMyLeave(page, perPage);
    const isFocused = useIsFocused();

    // Refetch when screen comes into focus
    useEffect(() => {
        if (isFocused) {
            refetch();
        }
    }, [isFocused]);

    if (isLoading) return (
        <View className="flex-1 bg-white p-5 gap-y-5">
            <Text>Loading...</Text>
        </View>
    );

    if (isError) return (
        <ErrorState
            title={((error as any)?.response?.data?.errors?.message ??
                (error as any)?.message ??
                "Unable to load leaves")}
            onRetry={refetch}
        />
    );

    const reviews = data?.data ?? [];
    const pagination = data?.pagination;

    return (
        <View className="flex-1 bg-white p-5">

            <View className="w-full flex-row justify-end">
                <Button
                    onPress={() => setApplyLeaveVisible(true)}
                    className="px-8"
                >
                    Apply Leave
                </Button>
            </View>

            <View>
                {reviews.map((review) => (
                    <MyLeavesCard
                        key={review.id}
                        leave={{
                            id: review.id,
                            type: review.type_label,
                            startDate: review.start_date_formatted,
                            endDate: review.end_date_formatted,
                            days: review.duration,
                            reason: review.reason,
                            status: review.status_label,
                        }}
                    />
                ))}

                {pagination && pagination.last_page > 1 && (
                    <Pagination
                        currentPage={page}
                        lastPage={pagination.last_page}
                        onPageChange={(p) => setPage(p)}
                        paginationLength={reviews.length}
                        paginationTotal={pagination.total}
                        paginationLabel="Leaves"
                    />
                )}
            </View>

            <ApplyLeaveModal
                visible={applyLeaveVisible}
                onClose={() => setApplyLeaveVisible(false)}
            />

        </View>
    );
};

export default MyLeaves;