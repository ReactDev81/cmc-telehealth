import AddNewEducationHistory from "@/components/doctor/profile/add-education-history";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import { useAuth } from "@/context/UserContext";
import { useDoctorProfile } from "@/queries/doctor/useDoctorProfile";
import { EducationHistoryGroup } from "@/types/live/doctor/profile";
import { GraduationCap } from "lucide-react-native";
import { useState } from "react";
import { ActivityIndicator, Modal, ScrollView, Text, View } from "react-native";

const EducationHistory = () => {
  const { user } = useAuth();
  const doctorID = user?.id || "";

  const { data: profileResponse, isLoading } =
    useDoctorProfile<EducationHistoryGroup>(doctorID, "education_info");

  const educationHistory = profileResponse?.data?.education_info || [];

  const [modalVisible, setModalVisible] = useState(false);

  return (
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
            <AddNewEducationHistory
              existingEducation={educationHistory}
              onClose={() => setModalVisible(false)}
            />
          </View>
        </View>
      </Modal>

      {/* Page Content */}
      <ScrollView className="flex-1 p-5">
        <Button
          className="max-w-52 ml-auto"
          onPress={() => setModalVisible(true)}
        >
          Add Education History
        </Button>

        {isLoading ? (
          <View className="mt-10">
            <ActivityIndicator size="large" color="#013220" />
          </View>
        ) : educationHistory.length > 0 ? (
          educationHistory.map((education, index) => {
            return (
              <View
                key={index}
                className="border border-black-200 rounded-xl p-4 flex-row gap-x-3 mt-5"
              >
                <View className="w-9 h-9 rounded-full bg-primary-200 items-center justify-center mt-0.5">
                  <GraduationCap color="#013220" size={16} />
                </View>

                <View className="flex-1">
                  <Text className="text-base text-black font-semibold">
                    {education.degree}
                  </Text>
                  <Text className="text-black-400 text-sm mt-0.5">
                    {education.institution}
                  </Text>
                  <View className="flex-row mt-1">
                    <Text className="text-primary text-sm">
                      {education.start_date} -{" "}
                    </Text>
                    <Text className="text-primary text-sm">
                      {education.end_date}
                    </Text>
                  </View>
                </View>
              </View>
            );
          })
        ) : (
          <EmptyState
            title="No Education History"
            message="You haven't added your educational background yet. Add your degrees and qualifications."
            icon={<GraduationCap size={48} color="#94A3B8" />}
            className="mt-10"
          />
        )}
      </ScrollView>
    </View>
  );
};

export default EducationHistory;
