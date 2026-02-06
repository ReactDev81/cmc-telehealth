import Testimonial from "@/components/patient/home/testimonial";
import { useTestimonials } from "@/queries/patient/useTestimonials";
import { htmlToReadableText } from "@/utils/html";
import { ChevronLeft, ChevronRight } from "lucide-react-native";
import { useState } from "react";
import { ActivityIndicator, FlatList, Text, TouchableOpacity, View } from "react-native";

const AllTestimonials = () => {
    const [page, setPage] = useState(1);
    const perPage = 5;
    const { data, isLoading, isError, isFetching } = useTestimonials(page, perPage);

    const testimonials = data?.data || [];
    const pagination = data?.pagination;

    if (isLoading && !data) {
        return (
            <View className="flex-1 items-center justify-center bg-white">
                <ActivityIndicator size="large" color="#013220" />
            </View>
        );
    }

    if (isError) {
        return (
            <View className="flex-1 items-center justify-center bg-white">
                <Text className="text-red-500 text-lg">Error loading testimonials</Text>
                <TouchableOpacity
                    onPress={() => setPage(1)}
                    className="mt-4 px-6 py-2 bg-primary rounded-lg"
                >
                    <Text className="text-white font-medium">Retry</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const handlePrev = () => {
        if (page > 1) setPage(page - 1);
    };

    const handleNext = () => {
        if (pagination && page < pagination.last_page) setPage(page + 1);
    };

    return (
        <View className="flex-1 bg-white">
            <FlatList
                data={testimonials}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ padding: 20, gap: 15 }}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                    <Testimonial
                        patient_image={{ uri: item.patient_image }}
                        patient_name={item.patient_name}
                        patient_age={item.patient_age?.toString()}
                        patient_location={item.patient_location}
                        days_ago={item.created_at}
                        title={item.title}
                        content={htmlToReadableText(item.content)}
                        total_reviews={item.total_reviews.toString()}
                        doctor_name={item.doctor_name}
                        // Required fields by TestimonialProps that are not used in UI but must be passed
                        patient_id={item.id}
                        doctor_id=""
                        rating={item.rating}
                        is_active={true}
                        is_featured={false}
                        slug={item.slug}
                        className="max-w-full"
                    />
                )}
                ListFooterComponent={
                    pagination && pagination.last_page > 1 ? (
                        <View className="mt-4 mb-10">
                            {/* Results Count Label */}
                            <View className="items-center mb-6">
                                <View className="bg-gray-100 px-4 py-1.5 rounded-full">
                                    <Text className="text-[11px] font-semibold text-black-400 uppercase tracking-widest">
                                        Showing {testimonials.length} of {pagination.total} Reviews
                                    </Text>
                                </View>
                            </View>

                            {/* Pagination Controls */}
                            <View className="flex-row items-center justify-between bg-primary-100 rounded-2xl p-3 border border-[#EDEDED]">
                                {/* Prev Button */}
                                <TouchableOpacity
                                    onPress={handlePrev}
                                    disabled={page === 1 || isFetching}
                                    activeOpacity={0.7}
                                    className={`w-11 h-11 items-center justify-center rounded-xl bg-white shadow-sm border border-[#EDEDED] ${page === 1 ? 'opacity-30' : ''}`}
                                >
                                    <ChevronLeft size={20} color="#013220" />
                                </TouchableOpacity>

                                {/* Page Numbers Row */}
                                <View className="flex-row items-center gap-x-2">
                                    {Array.from({ length: pagination.last_page }, (_, i) => i + 1).map((p) => {
                                        const isSelected = p === page;
                                        const isVisible =
                                            pagination.last_page <= 5 ||
                                            p === 1 ||
                                            p === pagination.last_page ||
                                            Math.abs(p - page) <= 1;

                                        if (!isVisible) {
                                            if (p === 2 || p === pagination.last_page - 1) {
                                                return <Text key={`dot-${p}`} className="text-black-400 text-xs text-center px-1">...</Text>;
                                            }
                                            return null;
                                        }

                                        return (
                                            <TouchableOpacity
                                                key={p}
                                                onPress={() => setPage(p)}
                                                disabled={isFetching || isSelected}
                                                className={`w-9 h-9 items-center justify-center rounded-lg ${isSelected ? 'bg-primary' : 'bg-transparent'}`}
                                            >
                                                <Text className={`text-sm font-bold ${isSelected ? 'text-white' : 'text-black'}`}>
                                                    {p}
                                                </Text>
                                            </TouchableOpacity>
                                        );
                                    })}
                                </View>

                                {/* Next Button */}
                                <TouchableOpacity
                                    onPress={handleNext}
                                    disabled={page === pagination.last_page || isFetching}
                                    activeOpacity={0.7}
                                    className={`w-11 h-11 items-center justify-center rounded-xl bg-white shadow-sm border border-[#EDEDED] ${page === pagination.last_page ? 'opacity-30' : ''}`}
                                >
                                    <ChevronRight size={20} color="#013220" />
                                </TouchableOpacity>
                            </View>

                            {isFetching && (
                                <View className="absolute -top-6 left-0 right-0 items-center">
                                    <View className="bg-primary px-4 py-1 rounded-full shadow-lg">
                                        <Text className="text-[10px] font-bold text-white">Updating...</Text>
                                    </View>
                                </View>
                            )}
                        </View>
                    ) : isFetching ? (
                        <View className="py-10 items-center">
                            <ActivityIndicator color="#013220" />
                        </View>
                    ) : null
                }
                ListEmptyComponent={
                    !isLoading ? (
                        <View className="flex-1 items-center justify-center mt-24">
                            <Text className="text-gray-400 text-lg">No testimonials found</Text>
                        </View>
                    ) : null
                }
            />
        </View>
    );
};

export default AllTestimonials;
