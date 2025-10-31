import { useState } from 'react';
import { View, Text, TouchableOpacity, Platform, Modal } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { CalendarDays } from 'lucide-react-native';

type DateFieldProps = {
    label?: string;
    value?: Date | null;
    onChange: (date: Date | undefined) => void;
    placeholder?: string;
    disabled?: boolean;
    error?: string;
    className?: string;
    mode?: 'date' | 'time' | 'datetime';
    maximumDate?: Date;
    minimumDate?: Date;
};

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
}: DateFieldProps) => {
    
    const [show, setShow] = useState(false);

    const formatDate = (date: Date | null | undefined) => {
        if (!date) return '';
        if (mode === 'time') {
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            return `${hours}:${minutes}`;
        }
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const handleChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
        if (Platform.OS === 'android') {
            setShow(false);
        }
        if (event.type === 'set' && selectedDate) {
            onChange(selectedDate);
        } else if (event.type === 'dismissed') {
            setShow(false);
        }
    };

    return (
        <View className={`${className}`}>

            {label && <Text className="text-sm text-black mb-2.5">{label}</Text>}

            <TouchableOpacity
                className={`flex-row items-center justify-between bg-white border rounded-lg px-4 py-3 ${
                error ? 'border-red-500' : 'border-gray'
                } ${disabled ? 'opacity-50 bg-gray-50' : ''}`}
                onPress={() => !disabled && setShow(true)}
                disabled={disabled}
                activeOpacity={0.7}
            >
                <Text className={`text-base ${value ? 'text-black' : 'text-black-400'}`}>
                    {value ? formatDate(value) : placeholder}
                </Text>
                <View className="w-5 h-5">
                    <CalendarDays size={18} color="#6B7280" />
                </View>
            </TouchableOpacity>

            {error && <Text className="text-sm text-red-500 mt-1">{error}</Text>}

            {show && (
                Platform.OS === 'ios' ? (
                    <Modal transparent animationType="fade">
                        <View className="flex-1 justify-center bg-black/50">
                            <View className="mx-6 bg-white rounded-xl p-4">
                                <DateTimePicker
                                    value={value || new Date()}
                                    mode={mode}
                                    display="spinner"
                                    onChange={handleChange}
                                    maximumDate={maximumDate}
                                    minimumDate={minimumDate}
                                />
                                <TouchableOpacity
                                    className="mt-3 bg-primary py-3 rounded-lg"
                                    onPress={() => setShow(false)}
                                >
                                    <Text className="text-center text-white font-medium">Done</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>
                    ) : (
                    <DateTimePicker
                        value={value || new Date()}
                        mode={mode}
                        display="default"
                        onChange={handleChange}
                        maximumDate={maximumDate}
                        minimumDate={minimumDate}
                    />
                )
            )}
        </View>
    );
};

export default DateField;