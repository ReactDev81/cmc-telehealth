import React from 'react';
import { TextInput, TextInputProps, View, Text } from 'react-native';

interface TextAreaProps extends TextInputProps {
    label?: string;
    placeholder?: string;
    containerClassName?: string
}

const TextArea: React.FC<TextAreaProps> = ({ label, placeholder, containerClassName = "", className, ...props }) => {
    return (
        <View className={containerClassName}>
            {label && (
                <Text className="text-sm text-black mb-2.5">
                    {label}
                </Text>
            )}
            <TextInput
                multiline
                numberOfLines={5}
                placeholder={placeholder}
                textAlignVertical="top"
                className={`border border-gray rounded-lg px-4 py-3 h-32 ${className || ''}`}
                {...props}
            />
        </View>
    );
};

export default TextArea;