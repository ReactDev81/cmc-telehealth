import { forwardRef } from 'react';
import { TextInput, View, Text, Pressable, TextInputProps } from 'react-native';

type InputProps = TextInputProps & {
    label?: string;
    errorMessage?: string;
    left?: React.ReactNode;
    right?: React.ReactNode;
    onPressRight?: () => void;
    containerClassName?: string;
    inputClassName?: string;
};

const Input = forwardRef<TextInput, InputProps>((
    {
        label,
        errorMessage,
        left,
        right,
        onPressRight,
        containerClassName = '',
        inputClassName = '',
        ...props
    },  
    ref
) => {
        return (
            <View className={containerClassName}>
                {label ? (
                    <Text className="text-sm text-black mb-2.5">{label}</Text>
                ) : null}
                <View className={`border border-gray rounded-lg flex-row items-center ${errorMessage ? 'border-red-500' : ''}`}>
                    {left ? <View className="px-3 py-3">{left}</View> : null}
                    <TextInput ref={ref} className={`flex-1 px-4 py-3 ${inputClassName}`} {...props} />
                    {right ? (
                        <Pressable onPress={onPressRight} className="px-3 py-3">
                            {right}
                        </Pressable>
                    ) : null}
                </View>
                {errorMessage ? (
                    <Text className="text-xs text-red-600 mt-1">{errorMessage}</Text>
                ) : null}
            </View>
        );
    }
);

export default Input;