import FAQAccordian from "@/components/common/faq/faq-accordian";
import EmptyState from "@/components/ui/EmptyState";
import { useAuth } from "@/context/UserContext";
import { useAppProfileScreens } from "@/queries/common/useAppProfileScreens";
import { HelpCircle } from "lucide-react-native";
import { useCallback, useState } from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";

const Faq = () => {

    const { token } = useAuth();
    const { data, isLoading, error } = useAppProfileScreens(token || undefined);

    // singleOpen behavior: only one item open at a time
    const singleOpen = true;
    const defaultOpenId: string | null = "Medical Records";

    // screen-level state for which item is open
    const [openId, setOpenId] = useState<string | number | null>(defaultOpenId);

    const handleToggle = useCallback(
        (id: string | number) => (nextExpanded: boolean) => {
            if (!singleOpen) {
                setOpenId((current) =>
                nextExpanded ? id : current === id ? null : current,
                );
                return;
            }

            setOpenId((current) => {
                if (nextExpanded) return id;
                if (current === id) return null;
                return current;
            });
        },
        [singleOpen],
    );

    const faqData = data?.faq;

    return (
        <View className="flex-1 bg-white p-5">
            <ScrollView>
                {isLoading ? (
                    <ActivityIndicator size="large" color="#013220" />
                ) : error ? (
                    <Text className="text-red-500">
                        {error.message || "Error loading FAQs"}
                    </Text>
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
                    <EmptyState
                        title="No FAQs Available"
                        message="Frequently asked questions are not available at the moment. Please check back later."
                        icon={<HelpCircle size={48} color="#94A3B8" />}
                        className="mt-20"
                    />
                )}
            </ScrollView>
        </View>
    );
};
export default Faq;
