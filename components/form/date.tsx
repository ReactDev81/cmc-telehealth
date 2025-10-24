import { useState } from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { CalendarDays } from 'lucide-react-native';

const DateField = ({
    label,
    value,
    onChange,
    placeholder = 'DD/MM/YYYY',
    disabled = false,
    error,
    className = '',
    mode = 'date',
    maximumDate,
    minimumDate,
}: {
    label?: string;
    value: Date | undefined | null;
    onChange: (date: Date | undefined) => void;
    placeholder?: string;
    disabled?: boolean;
    error?: string;
    className?: string;
    mode?: 'date' | 'time' | 'datetime';
    maximumDate?: Date;
    minimumDate?: Date;
}) => {

    const [show, setShow] = useState(false);

    const formatDate = (date: Date | null | undefined) => {
        if (!date) return '';
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const handleChange = (event: any, selectedDate?: Date) => {
        if (Platform.OS === 'android') {
            setShow(false);
        }
        if (event.type === 'set' && selectedDate) {
            onChange(selectedDate);
            if (Platform.OS === 'ios') {
                setShow(false);
            }
        } else if (event.type === 'dismissed') {
            setShow(false);
        }
    };

    return (
        <View className={`${className}`}>
            
            {label && (
                <Text className="text-sm text-black mb-2.5">
                    {label}
                </Text>
            )}

            <TouchableOpacity
                className={`flex-row items-center justify-between bg-white border rounded-lg px-4 py-3 ${
                    error ? 'border-red-500' : 'border-gray'
                } ${disabled ? 'opacity-50 bg-gray-50' : ''}`}
                onPress={() => !disabled && setShow(true)}
                disabled={disabled}
                activeOpacity={0.7}
            >
                <Text
                    className={`text-base ${
                        value ? 'text-gray' : 'text-gray-400'
                    }`}
                >
                    {value ? formatDate(value) : placeholder}
                </Text>
                <View className="w-5 h-5">
                    <CalendarDays size={16} color="#929292" />
                </View>
            </TouchableOpacity>

            {error && (
                <Text className="text-sm text-red-500 mt-1">{error}</Text>
            )}

            {show && (
                <DateTimePicker
                    value={value || new Date()}
                    mode={mode}
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={handleChange}
                    maximumDate={maximumDate}
                    minimumDate={minimumDate}
                />
            )}
        </View>
    );
};

export default DateField;