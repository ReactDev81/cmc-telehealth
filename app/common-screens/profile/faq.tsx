import FAQAccordian from "@/components/common/faq/faq-accordian";
import { useAppProfileScreens } from "@/queries/common/useAppProfileScreens";
import { useCallback, useState } from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";

const Faq = () => {
  const { data, isLoading, error } = useAppProfileScreens();

  // singleOpen behavior: only one item open at a time
  const singleOpen = true;
  const defaultOpenId: string | null = "Medical Records";

  // screen-level state for which item is open
  const [openId, setOpenId] = useState<string | number | null>(defaultOpenId);

  const handleToggle = useCallback(
    (id: string | number) => (nextExpanded: boolean) => {
      if (!singleOpen) {
        setOpenId((current) =>
          nextExpanded ? id : current === id ? null : current
        );
        return;
      }

      setOpenId((current) => {
        if (nextExpanded) return id;
        if (current === id) return null;
        return current;
      });
    },
    [singleOpen]
  );

  const faqData = data?.faq;
  console.log("data: ", faqData)

  return (
    <View className="flex-1 bg-white p-5">
      <ScrollView>
        {isLoading ? (
          <ActivityIndicator size="large" color="#013220" />
        ) : error ? (
          <Text className="text-red-500">{error.message || "Error loading FAQs"}</Text>
        ) : faqData && faqData.length > 0 ? (
          faqData.map((item) => (
            <FAQAccordian
              key={item.title}
              faq={item}
              expanded={openId === item.title}
              onToggle={handleToggle(item.title)}
            />
          ))
        ) : (
          <Text>No FAQs available</Text>
        )}
      </ScrollView>
    </View>
  );
};
export default Faq;
