import useApi from "@/hooks/useApi";
import { PrivacyPolicyProps } from "@/types/live/patient/profile";
import { useEffect } from "react";
import { ScrollView, Text, useWindowDimensions, View } from "react-native";
import RenderHTML from "react-native-render-html";

const PrivacyPolicy = () => {
  const { width } = useWindowDimensions();
  const { data, error, loading, fetchData } = useApi<{
    data: {
      privacy_policy: PrivacyPolicyProps;
    };
  }>("get", `${process.env.EXPO_PUBLIC_API_BASE_URL}/profile-others`, {
    headers: {
      Authorization: `Bearer ${process.env.EXPO_PUBLIC_token}`,
    },
  });

  useEffect(() => {
    fetchData();
  }, []);

  const tagsStyles = {
    h3: {
      fontSize: 16,
      fontWeight: "500",
      color: "#013220",
      marginTop: 16,
      marginBottom: 6,
    },
    p: {
      fontSize: 14,
      lineHeight: 24,
      color: "#4D4D4D",
      marginBottom: 10,
    },
    ul: {
      marginTop: 8,
      paddingLeft: 16,
    },
    li: {
      marginBottom: 8,
    },
    strong: {
      fontWeight: "500",
      color: "#1F1E1E",
    },
  };

  const privacyPolicyData = data?.data.privacy_policy;
  return (
    <ScrollView className="flex-1 bg-white p-5">
      {/* <View className="mt-5">
                <Text className="text-base text-black font-medium">Privacy Policy</Text>
                <Text className="text-sm leading-6 text-black-400 mt-2.5">
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been industry's standard dummy text ever since the when an unknown printer took a galley of type and scrambled it to make a type specimen book. 
                </Text>
                <Text className="text-sm leading-6 text-black-400 mt-2.5">
                    It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. 
                        <Text className="font-semibold">The point of using Lorem Ipsum</Text>  
                    is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here.
                </Text>
            </View>

            <View className="mt-5">
                <Text className="text-base text-black font-medium">Refund Policy</Text>
                <Text className="text-sm leading-6 text-black-400 mt-2.5">
                    Lorem Ipsum is simply dummy text of the printing and industry. Lorem Ipsum has been industry's standard dummy text ever since the when printer.
                </Text>
            </View>

            <View className="mt-5">
                <Text className="text-base text-black font-medium">Applicability</Text>
                <View className="flex-row gap-x-2 mt-5">
                    <View className="w-1 h-1 rounded-full bg-black-400 mt-2.5"></View>
                    <Text className="text-sm text-black-400">
                        Sed ut perspiciatis unde omnis iste natus error sit  
                    </Text>
                </View>

                <View className="flex-row gap-x-2 mt-2">
                    <View className="w-1 h-1 rounded-full bg-black-400 mt-2.5"></View>
                    <Text className="text-sm text-black-400">
                        Lorem Ipsum is simply dummy text of the printing  
                    </Text>
                </View>

                <View className="flex-row gap-x-2 mt-2">
                    <View className="w-1 h-1 rounded-full bg-black-400 mt-2.5"></View>
                    <Text className="text-sm text-black-400">
                        Contrary to popular belief, Lorem Ipsum is not  
                    </Text>
                </View>

                <View className="flex-row gap-x-2 mt-2">
                    <View className="w-1 h-1 rounded-full bg-black-400 mt-2.5"></View>
                    <Text className="text-sm text-black-400">
                        Sed ut perspiciatis unde omnis iste natus error sit   
                    </Text>
                </View>


            </View> */}

      {loading ? (
        <Text>Loading...</Text>
      ) : privacyPolicyData ? (
        <View className="mb-14">
          <RenderHTML
            source={{ html: privacyPolicyData }}
            contentWidth={width}
            tagsStyles={tagsStyles}
          />
        </View>
      ) : (
        <Text>{error}</Text>
      )}
    </ScrollView>
  );
};

export default PrivacyPolicy;
