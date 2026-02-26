import Button from "@/components/ui/Button"
import { appointmentProps } from "@/types/patient/appointment"
import { router } from "expo-router"
import { Calendar, ChevronRight, Clock, Hospital, Phone, Star, Video } from "lucide-react-native"
import { Image, Text, View } from "react-native"

const UpcomingAppointments = ({
    appointment_id,
    image,
    name,
    speciality,
    consultation_type,
    consultation_fee,
    experience,
    average_rating,
    date,
    time,
    call_now,
    join_url,
    doctor_name,
    doctor_id,
    status
}: appointmentProps) => {

    const id = appointment_id;

    return (
        <View className='border border-black-300 rounded-xl p-4 mb-5'>

            <View className='flex-row items-center gap-x-3'>
                <View>
                    <Image
                        source={image}
                        className='w-14 h-14 rounded-full'
                    />
                </View>
                <View className='flex-1'>
                    <Text className='text-sm text-black font-medium'>{name}</Text>
                    <Text className='text-xs text-black mt-1.5'>{speciality} ({experience} Exp)</Text>
                    <View className="flex-row items-center gap-x-3 mt-1">
                        <View className="flex-row items-center gap-x-1.5">
                            <Calendar size={12} strokeWidth={1.5} className="text-black-400" />
                            <Text className="text-sm text-black-400">{date}</Text>
                        </View>
                        <View className="flex-row items-center gap-x-1.5">
                            <Clock size={12} strokeWidth={1.5} className="text-black-400" />
                            <Text className="text-sm text-black-400">{time}</Text>
                        </View>
                    </View>
                    <View className='py-1 px-2 bg-primary-100 rounded-lg flex-row items-center gap-x-1 absolute top-0 right-0'>
                        <Star size={12} fill="#013220" />
                        <Text className='text-primary text-sm font-medium'>{average_rating}</Text>
                    </View>
                    {status === "completed" && (
                        <View className="py-1 p-1.5 rounded absolute bottom-0 right-0 bg-success-400">
                            <Text className="text-[10px] font-medium text-success">
                                {status}
                            </Text>
                        </View>
                    )}
                </View>
            </View>

            <View className='p-4 bg-primary-100 rounded-lg mt-3'>
                <View className='flex-row items-center justify-between gap-x-5'>
                    <View>
                        <Text className='text-sm text-black font-medium'>Consultation Type</Text>
                        <View className='flex-row items-center gap-x-1.5 mt-1'>
                            {
                                consultation_type === 'video' ?
                                    <Video color="#1ABE17" fill="#1ABE17" size={14} />
                                    :
                                    <Hospital color="#1ABE17" size={14} />
                            }
                            <Text className='text-success text-sm'>
                                {consultation_type}
                            </Text>
                        </View>
                    </View>
                    <View className="w-px h-full bg-primary-200"></View>
                    <View>
                        <Text className='text-right text-sm text-black font-medium'>Consultation Fee</Text>
                        <Text className='text-right text-sm text-black-400 mt-1'>₹{consultation_fee}</Text>
                    </View>
                </View>
                <View className="mt-3 flex-1 flex-row items-center gap-x-2.5">
                    {
                        call_now ?
                            <Button
                                className="flex-1"
                                icon={<Phone color="#fff" size={16} />}
                                onPress={() => router.push({
                                    pathname: '/patient/start-consulation',
                                    params: {
                                        patient_call_link: join_url,
                                        appointment_id: appointment_id,
                                        doctor_name: doctor_name,
                                        doctor_id: doctor_id
                                    },
                                })}
                            >
                                Call Now
                            </Button>
                        : status === "completed" ? (
                                <Button
                                    className="flex-row-reverse w-full"
                                    icon={<ChevronRight color="#fff" size={16} strokeWidth={3} />}
                                    onPress={() => router.push(`/patient/past-appointment-details/${id}`)}
                                >
                                    View Detail
                                </Button>
                        ) :
                            <Button
                                className="flex-1"
                                onPress={() => router.push(`/patient/manage-appointment/${appointment_id}`)}
                            >
                                Manage Appointments
                            </Button>
                    }

                </View>

            </View>

        </View>
    )
}

export default UpcomingAppointments