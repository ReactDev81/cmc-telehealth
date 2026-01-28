import { useTransactionDetails } from "@/queries/patient/useTransactionDetails";
import { useLocalSearchParams } from "expo-router";
import { ArrowDownToLine, Check, Clock, FileText, X } from 'lucide-react-native';
import { ActivityIndicator, Linking, ScrollView, Text, TouchableOpacity, View } from "react-native";

const TransactionDetails = () => {

    const { id } = useLocalSearchParams<{ id?: string }>();
    const { data, isLoading, isError, error } = useTransactionDetails(id);

    if (isLoading) {
        return (
            <View className="flex-1 items-center justify-center bg-white">
                <ActivityIndicator size="large" />
            </View>
        );
    }
      
    if (isError) {
        return (
            <View className="flex-1 items-center justify-center bg-white">
                <Text className="text-red-500">
                    {error instanceof Error ? error.message : "Failed to load transaction"}
                </Text>
            </View>
        );
    }
      
    const transaction = data?.data;

    const statusText = {
        paid: "Transaction Successful",
        pending: "Transaction Pending",
        failed: "Transaction Failed",
        refunded: "Transaction Refunded",
    };

    const statusIcon = {
        paid: (
            <View className="w-14 h-14 rounded-full bg-success-400 items-center justify-center">
                <Check size={20} color="#1ABE17" strokeWidth={4} />
            </View>
        ),
        pending: (
            <View className="w-14 h-14 rounded-full bg-warning-400 items-center justify-center">
                <Clock size={20} color="#EAB300" strokeWidth={4} />
            </View>
        ),
        failed: (
            <View className="w-14 h-14 rounded-full bg-danger-400 items-center justify-center">
                <X size={20} color="#FF0000" strokeWidth={4} />
            </View>
        ),
    };
      

    if (!transaction) {
        return null;
    }

    return (
        <ScrollView className="flex-1 p-5 bg-white">

            <View className="justify-center items-center">
                {statusIcon[transaction.status] || null}
                <Text className="text-black font-medium text-2xl mt-5">₹{transaction.amount}</Text>
                <Text className="text-black font-medium text-lg mt-2">
                    {statusText[transaction.status]}
                </Text>
                <Text className="text-black-400 text-sm mt-1">{transaction.date}</Text>
            </View>

            <View className="border border-black-300 rounded-xl mt-7 py-1 px-4">

                <View className="flex-row items-center justify-between py-4 border-b border-black-300">
                    <Text className="text-sm text-black-400">Transaction ID:</Text>
                    <Text className="text-sm text-black-400 font-medium">{transaction.transaction_id}</Text>
                </View>

                <View className="flex-row items-center justify-between py-4 border-b border-black-300">
                    <Text className="text-sm text-black-400">Order ID:</Text>
                    <Text className="text-sm text-black-400 font-medium">{transaction.order_id}</Text>
                </View>

                <View className="flex-row items-center justify-between py-4 border-b border-black-300">
                    <Text className="text-sm text-black-400">Paid To:</Text>
                    <View className="flex-row items-center gap-x-1.5">
                        <Text className="text-sm text-black-400 font-medium">
                            {
                                transaction.payment_type === "UPI Payment" ?
                                transaction.upi_id :
                                transaction.payment_type === "Card" ?
                                transaction.bank_name + ' Bank' :
                                transaction.payment_type === "Net Banking" ?
                                transaction.bank_name + ' Bank' :
                                null
                            }
                        </Text>
                    </View>
                </View>

                <View className="flex-row items-center justify-between py-4 border-b border-black-300">
                    <Text className="text-sm text-black-400">Payment type:</Text>
                    <Text className="text-sm text-black-400 font-medium capitalize pr-1">
                        {
                            transaction.payment_type === "UPI Payment" ?
                            transaction.payment_type :
                            transaction.payment_type === "Card" ?
                            transaction.card_type + ' Card' : 
                            transaction.payment_type === "Net Banking" ?
                            transaction.payment_type
                            : null
                        }
                    </Text>
                </View>

                <View className="flex-row items-center justify-between py-4 border-b border-black-300">
                    <Text className="text-sm text-black-400">Payment method:</Text>
                    <View className="flex-row items-center gap-x-1.5">
                        <Text className="text-sm text-black-400 font-medium">{transaction.payment_method}</Text>
                    </View>
                </View>

                <View className="flex-row items-center justify-between py-4">
                    <Text className="text-sm text-black-400">Account details:</Text>
                    <View>
                        {
                            transaction.payment_type === "Card" ? 
                                (
                                    <>
                                        <Text className="text-sm text-black-400 font-medium text-right">
                                            {transaction.bank_name} Bank
                                        </Text>
                                        <Text className="text-sm text-black-400">
                                            {transaction.payment_method}{transaction.payment_type}****{transaction.card_last4}
                                        </Text>
                                    </>
                                )
                                    
                                
                                // `${transaction.payment_method}${transaction.payment_type}****${transaction.card_last4}`
                                : transaction.payment_type === "UPI Payment" ? 
                                    (
                                        <Text className="text-sm text-black-400">{transaction.upi_id}</Text>
                                    )
                                : 
                                transaction.payment_type === "Net Banking" ? 
                                    (
                                        <>
                                            <Text className="text-sm text-black-400 font-medium text-right">
                                                {transaction.bank_name} Bank
                                            </Text>
                                            <Text className="text-sm text-black-400">
                                                {transaction.payment_type}
                                            </Text>
                                        </>
                                    )
                                : null
                        }
                    </View>
                </View>

            </View>

            <View className="mt-7">
                <Text className="text-base font-medium text-black">Attachments</Text>
                <TouchableOpacity 
                    className="border border-black-300 rounded-xl p-4 mt-5 flex-row items-center justify-between gap-x-2.5"
                    onPress={() => Linking.openURL(transaction.receipt_url)}
                >
                    
                    <View className="flex-row items-center justify-between gap-x-2.5">
                        <View className="w-9 h-9 items-center justify-center bg-black-200 rounded">
                            <FileText size={20} color="#929292" />
                        </View>
                        <View>
                            <Text className="text-base text-black">Receipt.pdf</Text>
                            <Text className="text-xs text-black-400 mt-1">Online receipt for this transcation</Text>
                        </View>
                    </View>

                    <View>
                        <ArrowDownToLine size={20} color="#929292" />
                    </View>

                </TouchableOpacity>
            </View>

        </ScrollView>
    );
};

export default TransactionDetails;