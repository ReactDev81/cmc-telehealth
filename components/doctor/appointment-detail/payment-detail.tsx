import { View, Text } from "react-native"

interface props {
    consultation: string,
    admin_fee: string,
    aditional_discount: string,
    total: string
}

const PaymentDetail = ({ consultation, admin_fee, aditional_discount, total } : props ) => {
    return(
        <View className="mt-7">
            <Text className="text-lg text-black font-medium">Payment Detail</Text>
            <View className="mt-4">
                <View className="flex-row items-center justify-between">
                    <Text className="text-sm text-black-400">Consultation</Text>
                    <Text className="text-sm font-medium text-black-400">₹ {consultation}</Text>
                </View>
                <View className="flex-row items-center justify-between mt-3">
                    <Text className="text-sm text-black-400">Admin Fee</Text>
                    <Text className="text-sm font-medium text-black-400">₹ {admin_fee}</Text>
                </View>
                <View className="flex-row items-center justify-between mt-3">
                    <Text className="text-sm text-black-400">Aditional Discount</Text>
                    <Text className="text-sm font-medium text-black-400">{aditional_discount}</Text>
                </View>
                <View className="flex-row items-center justify-between mt-3">
                    <Text className="text-sm text-black-400">Total</Text>
                    <Text className="text-sm font-medium text-black-400">₹ {total}</Text>
                </View>
            </View>
        </View>
    )
}

export default PaymentDetail