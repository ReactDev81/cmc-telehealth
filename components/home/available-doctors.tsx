import { View, Text, Image } from "react-native"
import { router } from "expo-router"
import { Star, ChevronRight, Video, Hospital} from "lucide-react-native"
import { AvailableDoctorsProps } from "../../types/home"
import Button from "../ui/Button"


const AvailableDoctors = ({ id, image, name, speciality, rating, consultation_type, consultation_fee, expercience } : AvailableDoctorsProps) => {
    return (
            <View className='border border-black-300 rounded-xl p-4 mt-4'>

                <View className='flex-row items-center gap-x-3'>
                    <View>
                        <Image 
                            source={image}
                            className='w-14 h-14 rounded-full' 
                        />
                    </View>
                    <View className='flex-1'>
                        <Text className='text-sm text-black font-medium'>{name}</Text>
                        <Text className='text-xs text-black mt-1.5'>{speciality} {expercience}</Text>
                        <View className='py-1 px-2 bg-primary-100 rounded-lg flex-row items-center gap-x-1 absolute top-0 right-0'>
                            <Star size={12} fill="#013220" />
                            <Text className='text-primary text-sm font-medium'>{rating}</Text>
                        </View>
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
                                    {consultation_type === 'video' ? "Video consult" : "Clinic Visit"}
                                </Text>   
                            </View>
                        </View>
                        <View className="w-px h-full bg-primary-200"></View>
                        <View>
                            <Text className='text-right text-sm text-black font-medium'>₹{consultation_fee}</Text>
                            <Text className='text-right text-sm text-black-400 mt-1'>Consultation Fee</Text>
                        </View>
                    </View>
                    <Button 
                        className='mt-3 flex-row-reverse' 
                        icon={<ChevronRight color="#fff" size={16} strokeWidth={3} />}
                        onPress={() => router.push(`/patient/doctor/${id}`)}
                    >
                        Book Appointment
                    </Button>
                </View>

        </View>
    )
}

export default AvailableDoctors