import { View, Text } from "react-native"
import { PhoneCall, Mail } from 'lucide-react-native';

interface Props {
    number: string,
    email: string
}

const ContactInformation = ({ number, email } : Props) => {
    return(
        <View className="border border-black-300 rounded-xl p-4 mt-7">
            <Text className="text-lg font-medium text-black">Contact Information</Text>
            <View className="flex-row items-center gap-x-2 mt-2">
                <PhoneCall color="#4D4D4D" size={16} strokeWidth={1.5} />
                <Text className="text-sm text-black-400">{number}</Text>
            </View>
            <View className="flex-row items-center gap-x-2.5 mt-2">
                <Mail color="#4D4D4D" size={16} strokeWidth={1.5} />
                <Text className="text-sm text-black-400">{email}</Text>
            </View>
        </View>
    )
}

export default ContactInformation