import { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import Button from '../../ui/Button';

type TimeSlot = {
    id: string;
    time: string;
    available: boolean;
};

const DoctorSchedule = () => {

    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);

    // Generate 14 days from today
    const generateTwoWeeks = () => {
        const dates = [];
        const today = new Date();
        
        for (let i = 0; i < 14; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);
            dates.push(date);
        }
        
        return dates;
    };

    // Format day name (Mon, Tue, Wed, etc.)
    const getDayName = (date: Date) => {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        return days[date.getDay()];
    };

    // Get current month and year for header
    const getMonthYear = (date: Date) => {
        const months = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        return `${months[date.getMonth()]} ${date.getFullYear()}`;
    };

    // Check if date is selected
    const isSelected = (date: Date) => {
        return date.toDateString() === selectedDate.toDateString();
    };

    // Generate time slots based on selected date
    const generateTimeSlots = (): TimeSlot[] => {
        const slots: TimeSlot[] = [
            { id: '1', time: '09-10 AM', available: true },
            { id: '2', time: '10-11 AM', available: true },
            { id: '3', time: '11-12 AM', available: true },
            { id: '4', time: '12-01 PM', available: true },
            { id: '5', time: '01-02 PM', available: true },
            { id: '6', time: '02-03 PM', available: true },
            { id: '7', time: '03-04 PM', available: true },
            { id: '8', time: '04-05 PM', available: true },
        ];

        const dayOfWeek = selectedDate.getDay();
        
        // Example: Make some slots unavailable on weekends
        if (dayOfWeek === 0 || dayOfWeek === 6) {
            slots[0].available = false;
            slots[7].available = false;
        }

        return slots;
    };

    const twoWeeksDates = generateTwoWeeks();
    const timeSlots = generateTimeSlots();

    return (
        <View className="mt-7">

            {/* Header */}
            <View className="flex-row justify-between items-center">
                <Text className="text-lg font-medium text-black">Schedules</Text>
                <Text className="text-sm text-black-400 font-medium">{getMonthYear(selectedDate)}</Text>
            </View>

            {/* Dates ScrollView */}
            <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 10 }}
                className="mt-5"
            >
                {twoWeeksDates.map((date, index) => {

                    const isCurrentSelected = isSelected(date);
                    
                    return (
                        <View key={index} className=''>
                            <TouchableOpacity
                                onPress={() => {
                                    setSelectedDate(date);
                                    setSelectedTimeSlot(null); 
                                }}
                                className={`items-center justify-center w-11 h-11 rounded-md ${
                                    isCurrentSelected ? 'bg-primary' : 'bg-gray-100'
                                }`}
                            >
                                <Text className={`text-base font-medium ${isCurrentSelected ? 'text-white' : 'text-black-400'}`}>
                                    {date.getDate()}
                                </Text>
                            </TouchableOpacity>
                            <Text className="text-sm text-black-400 text-center mt-1">
                                {getDayName(date)}
                            </Text>
                        </View>
                    );
                })}
            </ScrollView>

            {/* Time Slots */}
            <View className="bg-primary-100 rounded-xl p-4 mt-6">
                <View className="flex-row flex-wrap gap-y-2.5 justify-between">
                    {timeSlots.map((slot) => (
                        <TouchableOpacity
                            key={slot.id}
                            onPress={() => slot.available && setSelectedTimeSlot(slot.id)}
                            disabled={!slot.available}
                            className={`p-2.5 rounded ${
                                selectedTimeSlot === slot.id
                                    ? 'bg-primary'
                                    : slot.available
                                    ? 'bg-white'
                                    : 'bg-gray-200'
                            }`}
                            style={{ width: '22%' }}
                        >
                            <Text className={`text-xs font-medium text-center ${
                                selectedTimeSlot === slot.id
                                    ? 'text-white'
                                    : slot.available
                                    ? 'text-black-400'
                                    : 'text-gray-400'
                            }`}>
                                {slot.time}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {/* Book Appointment */}
            <Button className='mt-8' onPress={() => router.push('/patient/appointment-summary')}>Book Appointment (₹60.00)</Button>

        </View>
    );
};

export default DoctorSchedule;