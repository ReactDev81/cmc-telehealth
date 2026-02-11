import { Image, ImageSource } from 'expo-image';
import React from 'react';
import { ImageSourcePropType, Text, View } from 'react-native';

interface AvatarProps {
    source?: string | ImageSource | number | ImageSourcePropType;
    name?: string;
    size?: number;
    className?: string;
    rounded?: boolean;
}

const Avatar = ({
    source,
    name,
    size = 48,
    className = '',
    rounded = true
}: AvatarProps) => {
    const [error, setError] = React.useState(false);

    const getInitials = (fullName?: string) => {
        if (!fullName) return '';
        const parts = fullName.split(' ');
        if (parts.length >= 2) {
            return (parts[0][0] + parts[1][0]).toUpperCase();
        }
        return parts[0][0].toUpperCase();
    };

    const showFallback = !source || error;

    return (
        <View
            className={`overflow-hidden items-center justify-center bg-gray-200 ${className}`}
            style={{
                width: size,
                height: size,
                borderRadius: rounded ? size / 2 : 8
            }}
        >
            {showFallback ? (
                <View className="flex-1 items-center justify-center w-full h-full bg-primary-200">
                    <Text
                        className="text-primary font-bold"
                        style={{ fontSize: size * 0.4 }}
                    >
                        {getInitials(name) || '?'}
                    </Text>
                </View>
            ) : (
                <Image
                    source={source}
                    style={{ width: '100%', height: '100%' }}
                    contentFit="cover"
                    transition={200}
                    onError={() => setError(true)}
                />
            )}
        </View>
    );
};

export default Avatar;
