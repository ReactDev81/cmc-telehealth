import useApi from "@/hooks/useApi";
import { TermAndConditionProps } from "@/types/live/patient/profile";
import { useEffect } from "react";
import { ScrollView, Text, View, useWindowDimensions } from "react-native";
import RenderHTML from "react-native-render-html";

const TermAndCondition = () => {
  const { width } = useWindowDimensions();
  const { data, error, loading, fetchData } = useApi<{
    data: {
      terms_and_conditions: TermAndConditionProps;
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

  const termsAndConditionsData = data?.data.term_and_conditios;
  return (
    <ScrollView className="flex-1 bg-white p-5">
      {/* <Text className="text-base text-black font-medium">Term And Condition</Text>

            <View>
                <View className="flex-row gap-x-2 mt-5">
                    <View className="w-1 h-1 rounded-full bg-black-400 mt-2.5"></View>
                    <Text className="text-sm text-black-400 font-medium leading-6">Lorem Ipsum: 
                        <Text className=" font-normal"> is simply dummy text of the and typesetting industry 1500s, when an unknown printer took a galley of type and scrambled</Text>
                    </Text>
                </View>

                <View className="flex-row gap-x-2 mt-5">
                    <View className="w-1 h-1 rounded-full bg-black-400 mt-2.5"></View>
                    <Text className="text-sm text-black-400 font-medium leading-6">Contrary: 
                        <Text className=" font-normal"> popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from.</Text>
                    </Text>
                </View>

                <View className="flex-row gap-x-2 mt-5">
                    <View className="w-1 h-1 rounded-full bg-black-400 mt-2.5"></View>
                    <Text className="text-sm text-black-400 font-medium leading-6">Variations: 
                        <Text className=" font-normal"> There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected.</Text>
                    </Text>
                </View>
            </View>

            <View className="mt-5">
                <Text className="text-base text-black font-medium">Definitions</Text>
                <Text className="text-sm leading-6 text-black-400 mt-2.5">
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been industry's standard dummy text ever since the when an unknown printer took a galley of type and scrambled it to make a type specimen book. It is a long established fact that a reader will be distracted by the readable content of a page when looking.
                </Text>
                <Text className="text-sm leading-6 text-black-400 mt-2.5">
                    The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing.
                </Text>
            </View> */}
      {loading ? (
        <Text>Loading...</Text>
      ) : termsAndConditionsData ? (
        <View className="mb-14">
          <RenderHTML
            source={{ html: termsAndConditionsData }}
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

export default TermAndCondition;
