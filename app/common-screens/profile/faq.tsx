import FAQAccordian from "@/components/common/faq/faq-accordian";
import useApi from "@/hooks/useApi";
import { FAQProps } from "@/types/live/patient/profile";
import { useCallback, useEffect, useState } from "react";
import { ScrollView, View } from "react-native";

const Faq = () => {
  const { data, error, loading, fetchData } = useApi<{
    data: {
      faq: FAQProps[];
    };
  }>("get", `${process.env.EXPO_PUBLIC_API_BASE_URL}/profile-others`, {
    headers: {
      Authorization: `Bearer ${process.env.EXPO_PUBLIC_token}`,
    },
  });

  useEffect(() => {
    fetchData();
  }, []);

  const faqData = data?.data.faq;

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

  return (
    <View className="flex-1 bg-white p-5">
      <ScrollView>
        {faqData?.map((item: FAQProps) => (
          <FAQAccordian
            key={item.title}
            faq={item}
            expanded={openId === item.title}
            onToggle={handleToggle(item.title)}
          />
        ))}
      </ScrollView>
    </View>
  );
};
export default Faq;
