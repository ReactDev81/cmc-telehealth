import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import { Check, FileText, ArrowDownToLine } from 'lucide-react-native';

const TransactionDetails = () => {
    return (
        <ScrollView className="flex-1 p-5 bg-white">

            <View className="justify-center items-center">
                <View className="w-14 h-14 rounded-full bg-primary-100 items-center justify-center">
                    <Check size={20} color="#013220" strokeWidth={4} />
                </View>
                <Text className="text-black font-medium text-2xl mt-5">₹1234</Text>
                <Text className="text-black font-medium text-lg mt-2">Transaction Successful</Text>
                <Text className="text-black-400 text-sm mt-1">16 Feb, 25, 1:20 PM</Text>
            </View>

            <View className="border border-black-300 rounded-xl mt-7 py-1 px-4">

                <View className="flex-row items-center justify-between py-4 border-b border-black-300">
                    <Text className="text-sm text-black-400">Transaction id:</Text>
                    <Text className="text-sm text-black-400 font-medium">#25261129785</Text>
                </View>

                <View className="flex-row items-center justify-between py-4 border-b border-black-300">
                    <Text className="text-sm text-black-400">Paid To:</Text>
                    <View className="flex-row items-center gap-x-1.5">
                        <Image source={require('../../../../assets/images/transactions/sbi.png')} />
                        <Text className="text-sm text-black-400 font-medium">SBI, Hanamkonda Branch</Text>
                    </View>
                </View>

                <View className="flex-row items-center justify-between py-4 border-b border-black-300">
                    <Text className="text-sm text-black-400">Transaction id:</Text>
                    <Text className="text-sm text-black-400 font-medium">#25261129785</Text>
                </View>

                <View className="flex-row items-center justify-between py-4 border-b border-black-300">
                    <Text className="text-sm text-black-400">Account No.</Text>
                    <Text className="text-sm text-black-400 font-medium">1161289120851</Text>
                </View>

                <View className="flex-row items-center justify-between py-4 border-b border-black-300">
                    <Text className="text-sm text-black-400">Transaction type:</Text>
                    <View>
                        <Text className="text-sm text-black-400 font-medium text-right">Investment</Text>
                        <Text className="text-sm text-black-400">Chio mutual funds</Text>
                    </View>
                </View>

                <View className="flex-row items-center justify-between py-4 border-b border-black-300">
                    <Text className="text-sm text-black-400">Payment method:</Text>
                    <View className="flex-row items-center gap-x-1.5">
                        <Image source={require('../../../../assets/images/transactions/gpay.png')} />
                        <Text className="text-sm text-black-400 font-medium">UPI transfer</Text>
                    </View>
                </View>

                <View className="flex-row items-center justify-between py-4">
                    <Text className="text-sm text-black-400">Account details:</Text>
                    <View>
                        <Text className="text-sm text-black-400 font-medium text-right">Canara Bank</Text>
                        <Text className="text-sm text-black-400">UPI Id:123645054@axl</Text>
                    </View>
                </View>

            </View>

            <View className="mt-7">
                <Text className="text-base font-medium text-black">Attachments</Text>
                <TouchableOpacity className="border border-black-300 rounded-xl p-4 mt-5 flex-row items-center justify-between gap-x-2.5">
                    
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