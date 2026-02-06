import { FaqAccordian } from "@/types/common/faq";
import { ChevronDown, ChevronRight } from "lucide-react-native";
import React, { useCallback, useEffect, useState } from "react";
import {
  AccessibilityProps,
  LayoutAnimation,
  Platform,
  Text,
  TouchableOpacity,
  UIManager,
  View
} from "react-native";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type Props = {
  faq: FaqAccordian;
  defaultExpanded?: boolean;
  onToggle?: (expanded: boolean) => void;
  expanded?: boolean;
} & AccessibilityProps;

const FAQAccordian: React.FC<Props> = ({
  faq,
  defaultExpanded = false,
  onToggle,
  expanded: controlledExpanded,
  accessibilityLabel,
}) => {
  const isControlled = typeof controlledExpanded === "boolean";
  const [internalExpanded, setInternalExpanded] =
    useState<boolean>(defaultExpanded);

  // if controlled, derive expanded from prop, else from internal state
  const expanded = isControlled ? controlledExpanded! : internalExpanded;

  // sync defaultExpanded if it changes and uncontrolled
  useEffect(() => {
    if (!isControlled) {
      setInternalExpanded(defaultExpanded);
    }
  }, [defaultExpanded]);

  const toggle = useCallback(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    if (!isControlled) {
      setInternalExpanded((v) => {
        const next = !v;
        onToggle?.(next);
        return next;
      });
    } else {
      onToggle?.(!controlledExpanded);
    }
  }, [isControlled, onToggle, controlledExpanded]);

  return (
    <View className="py-3.5 border-b border-[#EDEDED]">
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={toggle}
        className="flex-row"
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel ?? `${faq.title} toggle`}
        accessibilityState={{ expanded }}
      >
        {/* <View className="w-10 h-10 rounded-full bg-primary-100 items-center justify-center mr-3 overflow-hidden">
          {typeof faq.icon === "string" ? (
            <Image
              className="w-6 h-6"
              source={{ uri: faq.icon }}
              resizeMode="cover"
            />
          ) : (
            faq.icon as React.ReactNode
          )}
        </View> */}

        <View className="flex-1">
          <Text className="text-sm font-medium text-black mt-2">
            {faq.title}
          </Text>
          {expanded && (
            <Text className="text-sm text-[#6B6B6B] leading-6 mt-1">
              {faq.description}
            </Text>
          )}
        </View>

        <View className="mt-2">
          {expanded ? (
            <ChevronDown color="#333" size={20} />
          ) : (
            <ChevronRight color="#333" size={20} />
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default FAQAccordian;
