import { useState } from "react";
import { ScrollView, View, Text, Modal, TouchableOpacity } from "react-native"
import { BriefcaseBusiness } from 'lucide-react-native';
import Button from "@/components/ui/Button"
import { WorkingExperienceData } from "@/json-data/doctor/working-experience";
import AddNewWorkingExperience from "@/components/doctor/profile/add-working-experience";

const WorkingExperience = () => {

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
                    <AddNewWorkingExperience onClose={() => setModalVisible(false)} />
                </View>
                </View>
            </Modal>

            {/* Page Content */}
            <ScrollView className="flex-1 p-5">

                <Button className="max-w-52 ml-auto" onPress={() => setModalVisible(true)}>Add New Experience</Button>

                {WorkingExperienceData.map((experience) => {
                    return(
                        <View 
                            key={experience.id}
                            className="border border-black-200 rounded-xl p-4 flex-row items-center gap-x-3 mt-5"
                        >

                            <View className="w-9 h-9 rounded-full bg-primary-200 items-center justify-center">
                                <BriefcaseBusiness color="#013220" size={16} />
                            </View>

                            <View className="flex-1">
                                <Text className="text-base text-black">{experience.position}</Text>
                                <Text className="text-black-400 text-xs mt-0.5">{experience.place}</Text>
                            </View>

                            <View className="">
                                <Text className="text-black-400 text-xs">{experience.timeline}</Text>
                                <Text className="text-primary text-sm text-right mt-0.5">{experience.experience}</Text>
                            </View>

                        </View>
                    )
                })}

            </ScrollView>
            
        </View>
    )
}

export default WorkingExperience