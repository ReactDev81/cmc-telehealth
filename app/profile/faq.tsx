import React, { useCallback, useState } from "react";
import { ScrollView, View } from "react-native";
import FAQAccordian from "@/components/faq/faq-accordian";
import { FaqAccordianData } from "../../json-data/faq"


const Faq = () => {

    // singleOpen behavior: only one item open at a time
    const singleOpen = true;
    const defaultOpenId: string | number | null = "medical-records";

    // screen-level state for which item is open
    const [openId, setOpenId] = useState<string | number | null>(defaultOpenId);

    const handleToggle = useCallback(
        (id: string | number) => (nextExpanded: boolean) => {
            if (!singleOpen) {
                setOpenId((current) => (nextExpanded ? id : current === id ? null : current));
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

    return(
        <View className='flex-1 bg-white p-5'>
            <ScrollView>
                {FaqAccordianData.map((item, index) => (
                    <FAQAccordian
                        key={item.id}
                        faq={item}
                        expanded={openId === item.id}
                        onToggle={handleToggle(item.id)}
                    />
                ))}
            </ScrollView>
        </View>
    )
}
export default Faq