import { useState } from "react";
import { ScrollView, View, Text, Modal } from "react-native"
import { router } from "expo-router";
import { FileText } from 'lucide-react-native';
import Button from "@/components/ui/Button"
import { CertificatesData } from "@/json-data/doctor/certificates";
import AddNewCertificates from "@/components/doctor/profile/add-new-certificates";


const Certificates = () => {

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
                        <AddNewCertificates onClose={() => setModalVisible(false)} />
                    </View>
                </View>
            </Modal>

            {/* Page Content */}
            <ScrollView className="flex-1 p-5">

                <Button className="max-w-52 ml-auto" onPress={() => setModalVisible(true)}>Add New Certificate</Button>

                {CertificatesData.map((certificate) => {
                    return(
                        <View 
                            key={certificate.id}
                            className="border border-black-200 rounded-xl p-4 flex-row gap-x-3 mt-5"
                        >

                            <View className="w-9 h-9 rounded-full bg-primary-200 items-center justify-center mt-0.5">
                                <FileText color="#013220" size={16} strokeWidth={1.5} />
                            </View>

                            <View className="flex-1">
                                <View className="flex-row justify-between items-center">
                                    <Text className="text-base text-black">{certificate.certificate_name}</Text>
                                    <Text className="text-primary text-sm">{certificate.completed_date}</Text>
                                </View>
                                <Text className="text-black-400 text-sm mt-1">{certificate.description}</Text>
                                <Button 
                                    className="max-w-36 [&]:py-3 mt-2.5"
                                    onPress={() => router.push('https://marketplace.canva.com/EAGMPfFcHWI/1/0/1600w/canva-blue-and-white-simple-modern-certificate-of-appreciation-kYHEaKKpJI0.jpg')}
                                >
                                    View Certificate
                                </Button>
                                
                            </View>

                        </View>
                    )
                })}

            </ScrollView>
            
        </View>
    )
}

export default Certificates