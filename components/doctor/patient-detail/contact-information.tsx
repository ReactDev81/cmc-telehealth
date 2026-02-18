import { Mail, PhoneCall } from "lucide-react-native";
import { Linking, Pressable, Text, View } from "react-native";

interface Props {
  number: string;
  email: string;
}

const ContactInformation = ({ number, email }: Props) => {
  const handleCall = () => {
    // Strip everything except digits and leading + so tel: URI works correctly
    const dialNumber = number.replace(/[^\d+]/g, "");
    if (dialNumber) Linking.openURL(`tel:${dialNumber}`);
  };

  const handleEmail = () => {
    if (email) Linking.openURL(`mailto:${email}`);
  };

  return (
    <View className="border border-black-300 rounded-xl p-4 mt-7">
      <Text className="text-base font-medium text-black">
        Contact Information
      </Text>

      <View className="gap-y-3 mt-3">
        {/* Phone — tap to call */}
        <Pressable
          onPress={handleCall}
          className="flex-row items-center gap-x-2 active:opacity-60"
        >
          <PhoneCall size={14} />
          <Text className="text-sm text-primary flex-1" numberOfLines={1}>
            {number}
          </Text>
        </Pressable>

        {/* Email — tap to compose */}
        <Pressable
          onPress={handleEmail}
          className="flex-row items-center gap-x-2 active:opacity-60"
        >
          <Mail size={14} />
          <Text className="text-sm text-primary flex-1" numberOfLines={1}>
            {email}
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export default ContactInformation;
