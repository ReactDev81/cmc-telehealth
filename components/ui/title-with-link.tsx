import { Href, Link } from "expo-router";
import { ChevronRight } from "lucide-react-native";
import { Text, View } from "react-native";
import Title from "./Title";

interface TitleWithLinkProps {
  title_text: string;
  link?: Href;
  link_text?: string;
}

const TitleWithLink = ({ title_text, link, link_text }: TitleWithLinkProps) => {
  return (
    <View className="flex-row items-center justify-between">
      <Title className="flex-1 mr-3 mb-2" text={title_text} />
      {link && link_text && (
        <Link href={link} className="flex-shrink-0">
          <View className="flex-row items-center gap-x-1">
            <Text className="text-base font-medium text-primary">
              {link_text}
            </Text>
            <ChevronRight size={18} color="#013220" />
          </View>
        </Link>
      )}
    </View>
  );
};
export default TitleWithLink;
