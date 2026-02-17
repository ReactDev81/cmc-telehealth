import AddNewWorkingExperience from "@/components/doctor/profile/add-working-experience";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import { useAuth } from "@/context/UserContext";
import { useDoctorProfile } from "@/queries/doctor/useDoctorProfile";
import { WorkingExperienceGroup } from "@/types/live/doctor/profile";
import { BriefcaseBusiness } from "lucide-react-native";
import { useState } from "react";
import { ActivityIndicator, Modal, ScrollView, Text, View } from "react-native";

const WorkingExperience = () => {
  const { user } = useAuth();
  const doctorID = user?.id || "";

  const { data: profileResponse, isLoading } =
    useDoctorProfile<WorkingExperienceGroup>(doctorID, "working_experience");

  const workingExperience =
    profileResponse?.data?.professional_experience_info || [];

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
            <AddNewWorkingExperience
              existingExperiences={workingExperience}
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
          Add New Experience
        </Button>

        {isLoading ? (
          <View className="mt-10">
            <ActivityIndicator size="large" color="#013220" />
          </View>
        ) : workingExperience.length > 0 ? (
          workingExperience.map((experience, index) => {
            return (
              <View
                key={index}
                className="border border-black-200 rounded-xl p-4 flex-row items-center gap-x-3 mt-5"
              >
                <View className="w-9 h-9 rounded-full bg-primary-200 items-center justify-center">
                  <BriefcaseBusiness color="#013220" size={16} />
                </View>

                <View className="flex-1">
                  <Text className="text-base text-black font-semibold">
                    Association {index + 1}
                  </Text>
                  <Text className="text-black-400 text-sm mt-0.5">
                    {experience.past_associations}
                  </Text>
                </View>

                <View className="">
                  <Text className="text-primary text-sm font-medium">
                    {experience.career_start}
                  </Text>
                </View>
              </View>
            );
          })
        ) : (
          <EmptyState
            title="No Work Experience"
            message="You haven't added any work experience yet. Add your experience."
            icon={<BriefcaseBusiness size={48} color="#94A3B8" />}
            className="mt-10"
          />
        )}
      </ScrollView>
    </View>
  );
};

export default WorkingExperience;
