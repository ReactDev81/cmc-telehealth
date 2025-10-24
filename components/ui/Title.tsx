import { Text } from "react-native"

interface TitleProps {
    text: string;
    className?: string
}

const Title = ({ text, className = '' }: TitleProps) => {
    return(
        <Text className={`text-lg font-medium text-black ${className}`}>{text}</Text>
    )
}

export default Title