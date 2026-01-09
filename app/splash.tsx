import { router } from "expo-router";
import { useMemo, useState } from "react";
import {
  Image,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "../components/ui/Button";

export default function Splash() {
  const { width } = useWindowDimensions();
  const [page, setPage] = useState(0);

  const slides = useMemo(
    () => [
      {
        image: require("../assets/images/splash-1.png"),
        title: "Video consult top doctors from the comfort of your home.",
        description:
          "These are Specialists in their respective fields, which includes Brain & Nervous system",
      },
      {
        image: require("../assets/images/splash-2.png"),
        title: "Communicate in the best & effective way possible.",
        description:
          "Time & health are two precious assets that we don't compromise on.",
      },
    ],
    []
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Top slider area */}
      <View className="flex-1">
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(e) => {
            const idx = Math.round(e.nativeEvent.contentOffset.x / width);
            setPage(idx);
          }}
        >
          {slides.map((s, idx) => (
            <View key={idx} style={{ width }} className="px-6 pt-14">
              <View className="items-center">
                <Image source={s.image} className="w-80 h-72" />

                {/* Dots indicator (static position) */}
                <View className="flex-row gap-2 mt-10">
                  <View
                    className={`${
                      page === 0 ? "bg-primary" : "bg-gray-300"
                    } h-2 w-2 rounded-full`}
                  />
                  <View
                    className={`${
                      page === 1 ? "bg-primary" : "bg-gray-300"
                    } h-2 w-2 rounded-full`}
                  />
                </View>

                <View className="max-w-[360px] w-full">
                  <Text className="max-w-xs w-full mx-auto text-xl font-semibold text-center text-black mt-8 px-2">
                    {s.title}
                  </Text>
                  <Text className="text-base text-black-400 text-center mt-4 px-2">
                    {s.description}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Fixed footer with buttons */}
      <View className="px-6 pb-6">
        <Button onPress={() => router.push("/auth/login")}>Sign In</Button>

        <Button
          className="mt-3"
          variant="outline"
          onPress={() => router.push("/auth/register-send-otp")}
        >
          Create an account
        </Button>
      </View>
    </SafeAreaView>
  );
}
