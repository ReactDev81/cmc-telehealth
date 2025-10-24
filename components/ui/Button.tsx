import { Pressable, Text, ViewStyle } from 'react-native';
import { ReactNode } from 'react';

type ButtonVariant = 'filled' | 'outline';

type ButtonProps = {
    onPress?: () => void;
    children: ReactNode;
    variant?: ButtonVariant;
    className?: string;
    disabled?: boolean;
    style?: ViewStyle;
};

export default function Button({
    onPress,
    children,
    variant = 'filled',
    className = '',
    disabled = false,
    style,
}: ButtonProps) {

    const baseClasses = 'py-3.5 px-4 rounded-lg items-center justify-center border';
    const filled = 'bg-primary border-primary';
    const outline = 'border-black';
    const disabledClasses = disabled ? ' opacity-50' : '';
    const containerClasses = `${baseClasses} ${variant === 'filled' ? filled : outline} ${className}${disabledClasses}`;
    const textClasses = `${variant === 'filled' ? 'text-white' : 'text-black'} font-semibold`;

    return (
        <Pressable onPress={onPress} disabled={disabled} className={containerClasses} style={style}>
            <Text className={textClasses}>{children}</Text>
        </Pressable>
    );
}