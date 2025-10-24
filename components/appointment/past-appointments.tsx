import { View, Text, Image, FlatList } from "react-native"
import { Link } from "expo-router"
import { Calendar, Clock } from 'lucide-react-native'
import { appointmentProps } from "../../types/appointment"
import { PastAppointmentData } from "../../json-data/appointment"


const PastAppointment = () => {

    const renderDoctorItem = ({ item }: { item: appointmentProps }) => {

        const { status, link, image, name, speciality, date, time } = item;

        return (
            <Link href={link}>
                <View className="border border-black-300 rounded-xl p-4 flex-row gap-x-4">
                    <View className="w-24">
                        <Image source={image} className="w-full h-24 rounded-xl" />
                    </View>
                    <View className="flex-1">
                        <Text className={`text-xs capitalize font-medium w-fit p-2 rounded-md absolute right-0
                            ${status == 'completed' ? 'bg-[#E8F9E8] text-[#1ABE17]' : 'bg-[#FDE9ED] text-[#FF0000]'}`}>
                            {status}
                        </Text>
                        <Text className="text-sm font-medium text-black mt-3">{name}</Text>
                        <Text className="text-xs text-black mt-1">{speciality}</Text>
                        <View className="flex-row items-center gap-x-3 mt-3">
                            <View className="flex-row items-center gap-x-2">
                                <Calendar size={12} className="text-black-400" />
                                <Text className="text-sm text-black-400">{date}</Text>
                            </View>
                            <View className="flex-row items-center gap-x-2">
                                <Clock size={12} className="text-black-400" />
                                <Text className="text-sm text-black-400">{time}</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </Link>
        );
    };

    return(
        <FlatList
            data={PastAppointmentData}
            renderItem={renderDoctorItem}
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => <View className="h-5" />}
        />  
    )
}

export default PastAppointment