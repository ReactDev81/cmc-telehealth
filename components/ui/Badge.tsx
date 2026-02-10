import { Text, View } from 'react-native';

export type BadgeVariant = 'success' | 'danger' | 'warning' | 'primary' | 'secondary' | 'gray' | 'info';

interface BadgeProps {
    text: string;
    variant?: BadgeVariant;
    className?: string;
    textClassName?: string;
}

const Badge = ({ text, variant = 'gray', className = '', textClassName = '' }: BadgeProps) => {
    const getVariantStyles = () => {
        switch (variant) {
            case 'success':
                return { container: 'bg-success-400', text: 'text-success' };
            case 'danger':
                return { container: 'bg-danger-400', text: 'text-danger' };
            case 'warning':
                return { container: 'bg-warning-400', text: 'text-warning' };
            case 'info':
                return { container: 'bg-info-400', text: 'text-info' };
            case 'primary':
                return { container: 'bg-primary-200', text: 'text-primary' };
            case 'secondary':
                return { container: 'bg-secondary-400', text: 'text-secondary' };
            case 'gray':
            default:
                return { container: 'bg-black-300', text: 'text-black-400' };
        }
    };

    const styles = getVariantStyles();

    return (
        <View className={`px-2 py-1 rounded-md items-center justify-center ${styles.container} ${className}`}>
            <Text className={`text-xs font-medium capitalize ${styles.text} ${textClassName}`}>
                {text}
            </Text>
        </View>
    );
};

export default Badge;
