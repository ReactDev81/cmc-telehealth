import EmptyState from "@/components/ui/EmptyState";
import { useAuth } from "@/context/UserContext";
import { useAppProfileScreens } from "@/queries/common/useAppProfileScreens";
import { Handshake } from "lucide-react-native";
import {
    ActivityIndicator,
    ScrollView,
    Text,
    View,
    useWindowDimensions,
} from "react-native";
import RenderHTML from "react-native-render-html";

const TermAndCondition = () => {
  const { width } = useWindowDimensions();
  const { token } = useAuth();
  const { data, isLoading, error } = useAppProfileScreens(token || undefined);

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

  const termsAndConditionsData = data?.term_and_conditions;
  // console.log("data: ", termsAndConditionsData)
  return (
    <ScrollView className="flex-1 bg-white p-5">
      {isLoading ? (
        <ActivityIndicator size="large" color="#013220" />
      ) : error ? (
        <Text className="text-red-500">
          {error.message || "Error loading content"}
        </Text>
      ) : termsAndConditionsData ? (
        <View className="mb-14">
          <RenderHTML
            source={{ html: termsAndConditionsData }}
            contentWidth={width}
            tagsStyles={tagsStyles}
          />
        </View>
      ) : (
        <EmptyState
          title="No Content Available"
          message="Terms and conditions are not available at the moment. Please check back later."
          icon={<Handshake size={48} color="#94A3B8" />}
          className="mt-20"
        />
      )}
    </ScrollView>
  );
};

export default TermAndCondition;
