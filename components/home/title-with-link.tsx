import { View, Text} from "react-native"
import { ChevronRight } from 'lucide-react-native';
import { Link, Href } from "expo-router"
import Title from "../../components/ui/Title"

interface TitleWithLinkProps {
    title_text : string,
    link: Href,
    link_text: string
}

const TitleWithLink = ({title_text, link, link_text} : TitleWithLinkProps) => {
    return(
        <View className="flex-row items-center justify-between">
            <Title 
                text={title_text}
            />
            <Link 
                href={link}
            >
                <View className="flex-row items-center gap-x-1">
                    <Text className="text-sm font-medium text-black-400">{link_text}</Text>
                    <ChevronRight  
                        size={18} 
                        className="text-black-400"
                    />
                </View>
            </Link>  
        </View>
    )
}
export default TitleWithLink