import { ReactNode } from 'react';
import { Pressable, Text, ViewStyle } from 'react-native';

type ButtonVariant = 'filled' | 'outline';

type ButtonProps = {
    onPress?: () => void;
    children: ReactNode;
    icon?: ReactNode;
    variant?: ButtonVariant;
    className?: string;
    disabled?: boolean;
    style?: ViewStyle;
    id?: string;
};

export default function Button({
    onPress,
    children,
    variant = 'filled',
    className = '',
    disabled = false,
    style,
    icon,
    id,
}: ButtonProps) {

    const baseClasses = 'py-3.5 px-4 rounded-lg flex-row gap-x-2 items-center justify-center border';
    const filled = 'bg-primary border-primary';
    const outline = 'border-black';
    const disabledClasses = disabled ? ' opacity-50' : '';
    const containerClasses = `${baseClasses} ${variant === 'filled' ? filled : outline} ${className}${disabledClasses}`;
    const textClasses = `${variant === 'filled' ? 'text-white' : 'text-black'} font-semibold text-sm`;

    return (
        <Pressable 
            onPress={onPress} 
            disabled={disabled} 
            className={containerClasses} 
            style={style}
            id={id}
        >
            {icon}
            <Text className={textClasses}>{children}</Text>
        </Pressable>
    );
}