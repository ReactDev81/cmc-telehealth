import { useMyTransactions } from "@/queries/patient/useMyTransactions";
import { router } from "expo-router";
import { Check, Clock, RotateCcw, X } from "lucide-react-native";
import { useState } from "react";
import { FlatList, ScrollView, Text, TouchableOpacity, View } from "react-native";

const tabs = ["All", "Completed", "Pending", "Cancelled", "Refunded"];

const Transaction = () => {
    
    const { data, isLoading, isError, error, refetch } = useMyTransactions();
    const [activeTab, setActiveTab] = useState("All");

    const transactions = data?.data ?? [];

    const filteredData = (() => {
        if (activeTab === "All") return transactions;
        
        if (activeTab === "Completed") {
            return transactions.filter((t) => t.status === "paid");
        }

        if (activeTab === "Pending") {
            return transactions.filter((t) => t.status === "pending");
        }

        if (activeTab === "Refunded") {
            return transactions.filter((t) => t.status === "refunded");
        }
        
        return transactions.filter((t) => t.status === "failed");
    })();

    const statusIcon = {
        paid: (
            <View className="w-9 h-9 rounded-full bg-success-400 items-center justify-center">
                <Check size={14} color="#1ABE17" strokeWidth={4} />
            </View>
        ),
        pending: (
            <View className="w-9 h-9 rounded-full bg-warning-400 items-center justify-center">
                <Clock size={14} color="#EAB300" strokeWidth={4} />
            </View>
        ),
        failed: (
            <View className="w-9 h-9 rounded-full bg-danger-400 items-center justify-center">
                <X size={14} color="#FF0000" strokeWidth={4} />
            </View>
        ),
        refunded: (
            <View className="w-9 h-9 rounded-full bg-info-400 items-center justify-center">
                <RotateCcw size={14} color="#48A3D7" strokeWidth={4} />
            </View>
        ),
    };
      

    return(
        <View className='flex-1 bg-white p-5'>

            {/* Tabs */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 12 }}
            >
                {tabs.map((tab) => (
                    <TouchableOpacity
                        key={tab}
                        className={`px-5 py-2.5 rounded-lg ${activeTab === tab ? "bg-primary" : "border border-gray"}`}
                        onPress={() => setActiveTab(tab)}
                    >
                        <Text className={`text-sm font-medium ${activeTab === tab ? "text-white" : "text-gray-600"}`}>
                            {tab}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>


            {/* Transactions List */}
          {!isLoading && !isError && (
            <FlatList
              data={filteredData}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              onRefresh={refetch}
              refreshing={isLoading}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() =>
                    router.push(`/patient/profile/transactions/${item.id}`)
                  }
                  className="flex-row items-center justify-between border-b border-black-200 py-5"
                >
                  <View className="flex-row items-center gap-x-3">

                  {statusIcon[item.status] || null}

                    <View>
                      <Text className="text-base font-medium text-black">
                        {item.patient_name}
                      </Text>
                      <Text className="text-black-400 text-sm mt-1.5">
                        {item.upi_id}
                      </Text>
                    </View>
                  </View>

                  <View className="items-end">
                    <Text className="text-base text-black-400">
                      ₹ {item.amount}
                    </Text>
                    <Text className="text-black-400 text-sm mt-1">
                    {item.date}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
              ListEmptyComponent={() => (
                <View className="mt-20 items-center">
                  <Text className="text-gray-400">No transactions found</Text>
                </View>
              )}
            />
          )}

        </View>
    )
}
export default Transaction