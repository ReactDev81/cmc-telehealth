import { View, Text, TouchableOpacity } from 'react-native';

const RadioButton = ({ 
    name,
    options,
    value,
    onChange,
    label,
    direction = 'horizontal',
    disabled = false,
    className = ''
}: {
    name: string;
    options: Array<{ value: string; label: string; disabled?: boolean }>;
    value: string;
    onChange: (value: string) => void;
    label?: string;
    direction?: 'horizontal' | 'vertical';
    disabled?: boolean;
    className?: string;
}) => {
    return (
        <View className={`mb-4 ${className}`}>
            {label && <Text className="text-sm text-black mb-2.5">{label}</Text>}
            <View className={direction === 'vertical' ? 'flex-col space-y-3' : 'flex-row flex-wrap'}>
                {options.map((option, index) => (
                    <TouchableOpacity
                        key={option.value}
                        className={`flex-row items-center ${
                            disabled || option.disabled ? 'opacity-50' : ''
                        } ${direction === 'horizontal' && index < options.length - 1 ? 'mr-6 mb-2' : 'mb-2'}`}
                        onPress={() => !disabled && !option.disabled && onChange(option.value)}
                        disabled={disabled || option.disabled}
                        activeOpacity={0.7}
                    >
                        <View className={`w-3.5 h-3.5 rounded-full border justify-center items-center ${
                            value === option.value ? 'border-primary' : 'border-gray'
                        }`}>
                            {value === option.value && <View className="w-2 h-2 rounded-full bg-primary" />}
                        </View>
                        {option.label && (
                            <Text className={`ml-2 text-base ${
                                disabled || option.disabled 
                                ? 'text-gray-400' 
                                : value === option.value 
                                    ? 'text-primary' 
                                    : 'text-gray-700'
                            }`}>
                                {option.label}
                            </Text>
                        )}
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};

export default RadioButton;