import { Href, Link } from "expo-router";
import { ChevronRight } from 'lucide-react-native';
import { Text, View } from "react-native";
import Title from "./Title";

interface TitleWithLinkProps {
    title_text: string,
    link?: Href,
    link_text?: string
}

const TitleWithLink = ({ title_text, link, link_text }: TitleWithLinkProps) => {
    return (
        <View className="flex-row justify-between">
            <Title
                className="max-w-72"
                text={title_text}
            />
            {link && link_text && (
                <Link
                    href={link}
                >
                    <View className="flex-row items-center gap-x-1">
                        <Text className="text-base font-medium text-primary">{link_text}</Text>
                        <ChevronRight
                            size={18}
                            color="#013220"
                        />
                    </View>
                </Link>
            )}
        </View>
    )
}
export default TitleWithLink