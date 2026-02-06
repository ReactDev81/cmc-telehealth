import { useAppProfileScreens } from "@/queries/common/useAppProfileScreens";
import { ActivityIndicator, ScrollView, Text, View, useWindowDimensions } from "react-native";
import RenderHTML from "react-native-render-html";

const AboutUs = () => {
  const { width } = useWindowDimensions();
  const { data, isLoading, error } = useAppProfileScreens();

  const tagsStyles = {
    h3: {
      fontSize: 16,
      fontWeight: "500" as const,
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
      fontWeight: "500" as const,
      color: "#1F1E1E",
    },
  };

  const aboutUsData = data?.about_us;
  console.log("data: ", aboutUsData);

  return (
    <ScrollView className="flex-1 bg-white p-5">
      {isLoading ? (
        <ActivityIndicator size="large" color="#013220" />
      ) : error ? (
        <Text className="text-red-500">{error.message || "Error loading content"}</Text>
      ) : aboutUsData ? (
        <View className="mb-14">
          <RenderHTML
            source={{ html: aboutUsData }}
            contentWidth={width}
            tagsStyles={tagsStyles}
          />
        </View>
      ) : (
        <Text>No content available</Text>
      )}
    </ScrollView>
  );
};

export default AboutUs;
