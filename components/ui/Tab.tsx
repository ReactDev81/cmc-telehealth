import { ReactNode, useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

export interface TabItem {
  key: string;
  label: string;
  content: ReactNode;
}

interface TabProps {
  tabs: TabItem[];
  defaultTab?: string;
  onTabChange?: (tabKey: string) => void;
}

const Tab = ({ tabs, defaultTab, onTabChange }: TabProps) => {
  const [activeTab, setActiveTab] = useState<string>(
    defaultTab || tabs[0]?.key || "",
  );

  // Update active tab when defaultTab prop changes (e.g., from navigation)
  useEffect(() => {
    if (defaultTab && defaultTab !== activeTab) {
      setActiveTab(defaultTab);
    }
  }, [defaultTab]);

  const handleTabPress = (tabKey: string) => {
    setActiveTab(tabKey);
    onTabChange?.(tabKey);
  };

  const activeTabContent = tabs.find((tab) => tab.key === activeTab)?.content;

  return (
    <View className="w-full flex-1">
      {/* Tab Headers */}
      <View className="flex-row bg-primary-100 rounded-xl p-2">
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            className={`flex-1 py-3 rounded-xl  ${activeTab === tab.key ? "bg-primary" : "bg-transparent"}`}
            onPress={() => handleTabPress(tab.key)}
          >
            <Text
              className={`text-center text-sm leading-6 font-medium ${activeTab === tab.key ? "text-white" : "text-black-400"}`}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Tab Content */}
      <View className="flex-1 mt-4">{activeTabContent}</View>
    </View>
  );
};

export default Tab;
