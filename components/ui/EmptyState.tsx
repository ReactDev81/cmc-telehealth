import { Layers } from 'lucide-react-native';
import React from 'react';
import { Text, View } from 'react-native';
import Button from './Button';

interface EmptyStateProps {
    title: string;
    message?: string;
    icon?: React.ReactNode;
    actionLabel?: string;
    onAction?: () => void;
    className?: string;
}

const EmptyState = ({
    title,
    message,
    icon,
    actionLabel,
    onAction,
    className = ""
}: EmptyStateProps) => {
    return (
        <View className={`items-center justify-center p-8 bg-white ${className}`}>
            
            <View className="bg-black-100 p-5 rounded-full">
                {icon || <Layers size={40} color="#94A3B8" />}
            </View>

            <Text className="text-xl font-semibold text-black text-center mb-2">
                {title}
            </Text>

            {message && (
                <Text className="text-black-400 text-center mb-6 max-w-xs leading-5">
                    {message}
                </Text>
            )}

            {actionLabel && onAction && (
                <Button onPress={onAction} className="px-8">
                    {actionLabel}
                </Button>
            )}
        </View>
    );
};

export default EmptyState;
