import { useState } from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { router } from "expo-router";
import { Check, X } from "lucide-react-native"; 
import { Image } from "react-native";
import { TransactionsData } from "@/json-data/patient/transaction";

const tabs = ["All", "Completed", "Cancelled"];

const Transaction = () => {

    const [activeTab, setActiveTab] = useState("All");

    const filteredData =
      activeTab === "All"
        ? TransactionsData
        : activeTab === "Completed"
        ? TransactionsData.filter((t) => t.status === "success")
        : TransactionsData.filter((t) => t.status === "failed");

    return(
        <View className='flex-1 bg-white p-5'>

            {/* Tabs */}
            <View className="flex-row gap-x-3">
                {tabs.map((tab) => (
                    <TouchableOpacity
                        key={tab}
                        className={`px-5 py-2.5 rounded-lg ${
                        activeTab === tab ? "bg-primary" : "border border-gray"}`}
                        onPress={() => setActiveTab(tab)}
                    >
                        <Text className={`text-sm font-medium ${activeTab === tab ? "text-white" : "text-gray-600"}`}>
                            {tab}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Transactions List */}
            <FlatList
                data={filteredData}
                keyExtractor={(item) => item.id.toString()}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                    <TouchableOpacity 
                        onPress={() => router.push(`/patient/profile/transactions/[id]`)}
                        className="flex-row items-center justify-between border-b border-black-200 py-5"
                    >

                        <View className="flex-row items-center gap-x-3">
                            {item.status === "success" ? (
                                <View className="w-9 h-9 bg-primary-200 items-center justify-center rounded-full">
                                    <Check size={14} color="#013220" strokeWidth={3} />
                                </View>
                            ) : (
                                <View className="w-9 h-9 bg-danger-400 items-center justify-center rounded-full">
                                    <X size={14} color="#FF0000" />
                                </View>
                            )}
                            
                            <View>
                                <Text className="text-base font-medium text-black">
                                    {item.name}
                                </Text>
                                <View className="flex-row items-center gap-x-2 mt-1.5">
                                    <Image source={item.icon} />
                                    <Text className="text-black-400 text-sm">
                                        {item.paymentMethod}
                                    </Text>
                                </View>
                            </View>

                        </View>

                        <View className="items-end">
                            <Text className="text-base text-black-400">
                                {item.amount}
                            </Text>
                            <Text className="text-black-400 text-sm mt-1">{item.date}</Text>
                        </View>
                        
                    </TouchableOpacity>
                )}
            />
        </View>
    )
}
export default Transaction