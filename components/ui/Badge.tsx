import { Text, View } from 'react-native';

export type BadgeVariant = 'success' | 'danger' | 'warning' | 'primary' | 'secondary' | 'gray' | 'info';

interface BadgeProps {
    text: string;
    variant?: BadgeVariant;
    className?: string;
    pill?: boolean;
    textClassName?: string;
}

const Badge = ({ text, variant = 'gray', className = '', pill = false, textClassName = '' }: BadgeProps) => {
    const getVariantStyles = () => {
        switch (variant) {
            case 'success':
                return 'bg-success-400 text-success';
            case 'danger':
                return 'bg-danger-400 text-danger';
            case 'warning':
                return 'bg-warning-400 text-warning';
            case 'info':
                return 'bg-info-400 text-info';
            case 'primary':
                return 'bg-primary-200 text-primary';
            case 'secondary':
                return 'bg-secondary-400 text-secondary';
            case 'gray':
            default:
                return 'bg-black-300 text-black-400';
        }
    };

    const variantClass = getVariantStyles();
    const [bgClass, textClass] = variantClass.split(' ');

    return (
        <View className={`px-2.5 py-1 ${pill ? 'rounded-full' : 'rounded-md'} items-center justify-center ${bgClass} ${className}`}>
            <Text className={`text-[10px] capitalize font-bold tracking-wider ${textClass} ${textClassName}`}>
                {text}
            </Text>
        </View>
    );
};

export default Badge;
