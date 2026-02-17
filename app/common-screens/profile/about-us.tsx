import EmptyState from "@/components/ui/EmptyState";
import ErrorState from "@/components/ui/ErrorState";
import { useAuth } from "@/context/UserContext";
import { useAppProfileScreens } from "@/queries/common/useAppProfileScreens";
import { Info } from "lucide-react-native";
import {
  ActivityIndicator,
  ScrollView,
  View,
  useWindowDimensions,
} from "react-native";
import RenderHTML from "react-native-render-html";

const AboutUs = () => {
  const { width } = useWindowDimensions();
  const { token } = useAuth();
  const { data, isLoading, error, refetch } = useAppProfileScreens(
    token || undefined,
  );

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
  console.log("error: ", error);

  return (
    <ScrollView className="flex-1 bg-white p-5">
      {isLoading ? (
        <ActivityIndicator size="large" color="#013220" />
      ) : error ? (
        <ErrorState
          title="Unable to Load Content"
          message="We couldn't load the about us information. Please try again."
          onRetry={refetch}
        />
      ) : aboutUsData ? (
        <View className="mb-14">
          <RenderHTML
            source={{ html: aboutUsData }}
            contentWidth={width}
            tagsStyles={tagsStyles}
          />
        </View>
      ) : (
        <EmptyState
          title="No Content Available"
          message="About us information is not available at the moment. Please check back later."
          icon={<Info size={48} color="#94A3B8" />}
          className="mt-20"
        />
      )}
    </ScrollView>
  );
};

export default AboutUs;
