import Pagination from "@/components/ui/Pagination";
import { useAuth } from "@/context/UserContext";
import { useMyReviews } from "@/queries/common/useMyReviews";
import { Star } from 'lucide-react-native';
import { useState } from "react";
import { ActivityIndicator, FlatList, Image, Text, TouchableOpacity, View } from "react-native";

const MyReviews = () => {

    const { user } = useAuth();
    const userRole = user?.role ?? "patient";
    const [page, setPage] = useState(1);
    const perPage = 5;
    const { data, isLoading, isError, isFetching } = useMyReviews(page, perPage);

    const myReviews = data?.data || [];
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
                <Text className="text-red-500 text-lg">Error loading Reviews</Text>
                <TouchableOpacity
                    onPress={() => setPage(1)}
                    className="mt-4 px-6 py-2 bg-primary rounded-lg"
                >
                    <Text className="text-white font-medium">Retry</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const renderItem = ({ item }: any) => {
        
        const image = userRole === "patient" ? item?.doctor_avatar : item?.patient_image;
        const name = userRole === "patient" ? item?.doctor_name : item?.patient_name;
    
        return (
          <View className="bg-white rounded-xl border border-black-300 w-full justify-between p-5">
            <View className="flex-row justify-between items-start mb-2">
              <View className="flex-row gap-x-2">
                <Image
                  source={{ uri: image }}
                  className="w-10 h-10 rounded-full"
                />
    
                <View>
                  <Text className="text-sm text-black font-medium">{name}</Text>
                  <Text className="text-xs text-black mt-1">
                    {userRole === "patient"
                      ? `${item?.doctor_departments} (${item?.doctor_experience} Exp)`
                      : item?.patient_age}
                  </Text>
                </View>
              </View>
    
              <View className="py-1 px-2 bg-primary-100 rounded-lg flex-row items-center gap-x-1">
                <Star size={12} fill="#013220" />
                <Text className="text-primary text-sm font-medium">
                  {item?.rating}
                </Text>
              </View>
            </View>
    
            <Text className="text-xs leading-5 text-black">{item?.content}</Text>
          </View>
        );
      };

    return(
        <View className="flex-1 bg-white">
            <FlatList
                data={myReviews}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                contentContainerStyle={{ padding: 20, gap: 15 }}
                showsVerticalScrollIndicator={false}
                ListFooterComponent={
                    <>
                        {/* Loading spinner while page changes */}
                        {isFetching && (
                            <ActivityIndicator className="mt-4" color="#013220" />
                        )}
            
                        {/* Pagination */}
                        {pagination && pagination.last_page > 1 && (
                            <Pagination
                                currentPage={page}
                                lastPage={pagination.last_page}
                                onPageChange={(p) => setPage(p)}
                            />
                        )}
                    </>
                }
                ListEmptyComponent={
                    !isLoading ? (
                        <View className="flex-1 items-center justify-center mt-24">
                            <Text className="text-gray-400 text-lg">No Reviews found</Text>
                        </View>
                    ) : null
                }
            />
        </View>
    )
}

export default MyReviews