import { useState } from "react";
import { ScrollView, View, Text, Modal } from "react-native"
import { GraduationCap } from 'lucide-react-native';
import Button from "@/components/ui/Button"
import { EducationHistoryData } from "@/json-data/doctor/education-history";
import AddNewEducationHistory from "@/components/doctor/profile/add-education-history";


const EducationHistory = () => {

    const [modalVisible, setModalVisible] = useState(false);

    return(
        <View className="flex-1 bg-white">

            {/* Modal */}
            <Modal
                visible={modalVisible}
                animationType="fade"
                transparent
                onRequestClose={() => setModalVisible(false)}
            >
                <View className="flex-1 bg-black/40 justify-center items-center">
                    <View className="w-11/12 bg-white rounded-2xl">
                        <AddNewEducationHistory onClose={() => setModalVisible(false)} />
                    </View>
                </View>
            </Modal>

            {/* Page Content */}
            <ScrollView className="flex-1 p-5">

                <Button className="max-w-52 ml-auto" onPress={() => setModalVisible(true)}>Add Education History</Button>

                {EducationHistoryData.map((education) => {
                    return(
                        <View 
                            key={education.id}
                            className="border border-black-200 rounded-xl p-4 flex-row gap-x-3 mt-5"
                        >

                            <View className="w-9 h-9 rounded-full bg-primary-200 items-center justify-center mt-0.5">
                                <GraduationCap color="#013220" size={16} />
                            </View>

                            <View className="flex-1">
                                <Text className="text-base text-black">{education.education}</Text>
                                <Text className="text-black-400 text-sm mt-0.5">{education.place}</Text>
                                <View className="flex-row mt-1">
                                    <Text className="text-primary text-sm text-right">{education.start_date} - </Text>
                                    <Text className="text-primary text-sm text-right"> {education.end_date}</Text>
                                </View>
                            </View>

                        </View>
                    )
                })}

            </ScrollView>
            
        </View>
    )
}

export default EducationHistory