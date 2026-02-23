import FormLayout from "@/app/formLayout";
import EditSocialMedia from "@/components/doctor/profile/edit-social-media";
import Button from "@/components/ui/Button";
import { useAuth } from "@/context/UserContext";
import { useDoctorProfile } from "@/queries/doctor/useDoctorProfile";
import { SocialMediaGroup } from "@/types/live/doctor/profile";
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react-native";
import { useState } from "react";
import { ActivityIndicator, Modal, ScrollView, Text, View } from "react-native";

const SocialMedia = () => {
  const { user } = useAuth();
  const doctorID = user?.id || "";

  const { data: profileResponse, isLoading } =
    useDoctorProfile<SocialMediaGroup>(doctorID, "social_media");

  const socialLinks = profileResponse?.data?.social_links || {};

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
        <FormLayout transparent>
          <View className="flex-1 bg-black/40 justify-center items-center">
            <View className="w-11/12 bg-white rounded-2xl">
              <EditSocialMedia
                existingLinks={socialLinks}
                onClose={() => setModalVisible(false)}
              />
            </View>
          </View>
        </FormLayout>
      </Modal>

      {/* Page Content */}
      <ScrollView className="flex-1 p-5">
        <Button
          className="max-w-52 ml-auto"
          onPress={() => setModalVisible(true)}
        >
          Edit Social Media
        </Button>

        {isLoading ? (
          <View className="mt-10">
            <ActivityIndicator size="large" color="#013220" />
          </View>
        ) : (
          <View className="mt-5 gap-y-5">
            <View className="border border-black-200 rounded-xl p-4 flex-row gap-x-3">
              <View className="w-9 h-9 rounded-full bg-primary-200 items-center justify-center mt-0.5">
                <Facebook color="#013220" size={16} />
              </View>
              <View className="flex-1">
                <Text className="text-base text-black font-semibold">
                  Facebook
                </Text>
                <Text className="text-black-400 text-sm mt-0.5">
                  {socialLinks.facebook || "Not added yet"}
                </Text>
              </View>
            </View>

            <View className="border border-black-200 rounded-xl p-4 flex-row gap-x-3">
              <View className="w-9 h-9 rounded-full bg-primary-200 items-center justify-center mt-0.5">
                <Linkedin color="#013220" size={16} />
              </View>
              <View className="flex-1">
                <Text className="text-base text-black font-semibold">
                  LinkedIn
                </Text>
                <Text className="text-black-400 text-sm mt-0.5">
                  {socialLinks.linkedin || "Not added yet"}
                </Text>
              </View>
            </View>

            <View className="border border-black-200 rounded-xl p-4 flex-row gap-x-3">
              <View className="w-9 h-9 rounded-full bg-primary-200 items-center justify-center mt-0.5">
                <Instagram color="#013220" size={16} />
              </View>
              <View className="flex-1">
                <Text className="text-base text-black font-semibold">
                  Instagram
                </Text>
                <Text className="text-black-400 text-sm mt-0.5">
                  {socialLinks.instagram || "Not added yet"}
                </Text>
              </View>
            </View>

            <View className="border border-black-200 rounded-xl p-4 flex-row gap-x-3">
              <View className="w-9 h-9 rounded-full bg-primary-200 items-center justify-center mt-0.5">
                <Twitter color="#013220" size={16} />
              </View>
              <View className="flex-1">
                <Text className="text-base text-black font-semibold">
                  Twitter (X)
                </Text>
                <Text className="text-black-400 text-sm mt-0.5">
                  {socialLinks.twitter || "Not added yet"}
                </Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default SocialMedia;
