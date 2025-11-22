import { useMemo, useState, useCallback } from "react";
import { View, Text, Pressable, ScrollView, TouchableOpacity, TextStyle } from "react-native";
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import Segmented from "@/components/doctor/my-schedule/segmented";
import SlotCard from "@/components/doctor/my-schedule/slot-card";
import { Calendar } from "react-native-calendars";
import type { DateData } from "react-native-calendars";
import { addDays, eachDayOfInterval, endOfWeek, format, isSameDay, startOfDay, startOfWeek, addWeeks } from "date-fns";
import { Slot } from "@/types/doctor/schedule";

type CalendarHeaderStyles = {
    monthText?: TextStyle;
    dayTextAtIndex0?: TextStyle;
    dayTextAtIndex1?: TextStyle;
    dayTextAtIndex2?: TextStyle;
    dayTextAtIndex3?: TextStyle;
    dayTextAtIndex4?: TextStyle;
    dayTextAtIndex5?: TextStyle;
    dayTextAtIndex6?: TextStyle;
};

type ExtendedCalendarTheme = {
    todayTextColor?: string;
    selectedDayBackgroundColor?: string;
    selectedDayTextColor?: string;
    arrowColor?: string;
    dayTextColor?: string;
    'stylesheet.calendar.header'?: CalendarHeaderStyles;
};

const calendarTheme: ExtendedCalendarTheme = {
    todayTextColor: "#1ABE17",
    selectedDayBackgroundColor: "#013220",
    selectedDayTextColor: "#fff",
    arrowColor: "#1F1E1E",
    dayTextColor: '#4D4D4D',
    'stylesheet.calendar.header': {
        monthText: { fontSize: 16, fontWeight: '500', color: '#1F1E1E' },
        dayTextAtIndex0: { color: '#4D4D4D' },
        dayTextAtIndex1: { color: '#4D4D4D' },
        dayTextAtIndex2: { color: '#4D4D4D' },
        dayTextAtIndex3: { color: '#4D4D4D' },
        dayTextAtIndex4: { color: '#4D4D4D' },
        dayTextAtIndex5: { color: '#4D4D4D' },
        dayTextAtIndex6: { color: '#FF0000' }, // Sunday label
    },
};

const mock: Slot[] = [  
    { id: "1", start: "2025-11-03T06:30:00.000Z", end: "2025-11-03T14:00:00.000Z", capacity: 2, label: "In Person" },
    { id: "2", start: "2025-11-03T10:30:00.000Z", end: "2025-11-03T12:00:00.000Z", capacity: 2, label: "Video Call" },
    { id: "3", start: "2025-11-05T06:30:00.000Z", end: "2025-11-05T14:00:00.000Z", capacity: 2, label: "Video Call" },
    { id: "4", start: "2025-11-06T06:30:00.000Z", end: "2025-11-06T14:00:00.000Z", capacity: 2, label: "In Person" },
    { id: "5", start: "2025-11-07T16:00:00.000Z", end: "2025-11-07T17:30:00.000Z", capacity: 2, label: "Video Call" },
    { id: "6", start: "2025-11-08T06:30:00.000Z", end: "2025-11-08T14:00:00.000Z", capacity: 2, label: "In Person" },
];

type ViewMode = "Day" | "Week" | "Month";

const Schedules = () => {

    const [mode, setMode] = useState<ViewMode>("Month");
    const [selected, setSelected] = useState<Date>(startOfDay(new Date()));

    // Memoize calendar marks
    const marked = useMemo(() => {
        const marks: Record<string, any> = {};
        marks[format(selected, "yyyy-MM-dd")] = { selected: true };
        mock.forEach(s => {
            const k = format(new Date(s.start), "yyyy-MM-dd");
            marks[k] = { ...(marks[k] || {}), marked: true };
        });
        return marks;
    }, [selected]);

    // Day slots
    const daySlots = useMemo(
        () => mock.filter(s => isSameDay(new Date(s.start), selected)),
        [selected]
    );

    // Week calculation
    const weekDays = useMemo(() => {
        const weekStart = startOfWeek(selected, { weekStartsOn: 1 });
        const weekEnd = endOfWeek(selected, { weekStartsOn: 1 });
        return eachDayOfInterval({ start: weekStart, end: weekEnd });
    }, [selected]);

    const weekSections = useMemo(() => {
        return weekDays.map(d => ({
            title: format(d, "EEE"),
            data: mock.filter(s => isSameDay(new Date(s.start), d)),
            date: d,
        }));
    }, [weekDays]);

    // Navigation handlers
    const handlePrevious = useCallback(() => {
        if (mode === "Day") {
            setSelected(prev => addDays(prev, -1));
        } else if (mode === "Week") {
            setSelected(prev => addWeeks(prev, -1));
        } else {
            setSelected(prev => addDays(prev, -1));
        }
    }, [mode]);

    const handleNext = useCallback(() => {
        if (mode === "Day") {
            setSelected(prev => addDays(prev, 1));
        } else if (mode === "Week") {
            setSelected(prev => addWeeks(prev, 1));
        } else {
            setSelected(prev => addDays(prev, 1));
        }
    }, [mode]);

    // Date display text
    const dateDisplay = useMemo(() => {
        if (mode === "Week") {
            const weekStart = startOfWeek(selected, { weekStartsOn: 1 });
            const weekEnd = endOfWeek(selected, { weekStartsOn: 1 });
            return `${format(weekStart, "MMM d")} - ${format(weekEnd, "MMM d, yyyy")}`;
        }
        return format(selected, "dd MMMM, yyyy");
    }, [selected, mode]);

    return (
        <ScrollView className="flex-1 p-5 bg-white">

            <View className="pb-14">

                {/* Header */}
                <View>
                    <View className="flex-row items-center justify-between mb-5">
                        <Pressable 
                            onPress={handlePrevious} 
                            className="w-9 h-9 rounded-lg border border-black-300 items-center justify-center"
                        >
                            <ChevronLeft size={20} color="#1F1E1E" />
                        </Pressable>
                        <Text className="text-black text-base">{dateDisplay}</Text>
                        <Pressable 
                            onPress={handleNext} 
                            className="w-9 h-9 rounded-lg border border-black-300 items-center justify-center"
                        >
                            <ChevronRight size={20} color="#1F1E1E" />
                        </Pressable>
                    </View>
                    <Segmented value={mode} onChange={setMode} />
                </View>

                {/* Month View */}
                {mode === "Month" && (
                    <View className="mt-5">
                        <Calendar
                            style={{
                                borderWidth: 1,
                                borderColor: '#DCDCDC',
                                borderRadius: 8,
                                padding: 8,
                            }}
                            firstDay={1}       
                            hideExtraDays={false}                 
                            disableAllTouchEventsForDisabledDays 
                            enableSwipeMonths 
                            monthFormat="MMM, yyyy"              
                            markedDates={marked}
                            onDayPress={(d: DateData) => setSelected(new Date(d.dateString))}
                            theme={calendarTheme}
                            dayComponent={({ date, state, marking, onPress, onLongPress }) => {
                                if (!date) return null;
                                const isSunday = new Date(date.dateString).getDay() === 0;
                                const isSelected = !!marking?.selected;
                                const isDisabled =
                                  state === 'disabled' || marking?.disableTouchEvent === true;
                              
                                const textColor =
                                  isSelected ? '#FFFFFF' :
                                  isDisabled ? '#D1D5DB' :
                                  isSunday ? '#F04438' :
                                  '#4D4D4D';
                              
                                return (
                                    <>
                                        <TouchableOpacity
                                            disabled={isDisabled}
                                            activeOpacity={0.8}
                                            onPress={() => onPress?.(date)}
                                            onLongPress={() => onLongPress?.(date)}
                                            style={{
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                height: 30,
                                                width: 30,
                                                borderRadius: 4,
                                                backgroundColor: isSelected ? '#013220' : 'transparent',
                                            }}
                                        >
                                            <Text style={{ color: textColor, fontSize: 16 }}>{date.day}</Text>
                                        </TouchableOpacity>
                                        {marking?.marked && (
                                            <View
                                                style={{
                                                    height: 5, width: 5, borderRadius: 2.5,
                                                    backgroundColor: marking.dotColor || '#1ABE17', marginTop: 3
                                                }}
                                            />
                                        )}
                                    </>
                                  
                                );
                              }}                              
                        />
                        <Text className="mt-5 mb-2 font-semibold">Slots</Text>
                        {daySlots.length === 0 ? (
                            <Text className="text-neutral-400 mb-6">No slots for this day.</Text>
                        ) : (
                            daySlots.map((slot, index) => (
                                <View 
                                    key={slot.id} 
                                    className={index === daySlots.length - 1 ? '' : 'mb-4'} 
                                >
                                    <SlotCard slot={slot} />
                                </View>
                            ))
                        )}
                    </View>
                )}

                {/* Day View */}
                {mode === "Day" && (
                    <View className="mt-5">
                        <Text className="text-black text-base font-semibold mb-3">Slots</Text>
                        {daySlots.length === 0 ? (
                            <Text className="text-black-400 text-base">No slots today.</Text>
                        ) : (
                            daySlots.map((slot, index) => (
                                <View 
                                    key={slot.id} 
                                    className={index === daySlots.length - 1 ? '' : 'mb-4'} 
                                >
                                    <SlotCard slot={slot} />
                                </View>
                            ))
                        )}
                    </View>
                )}

                {/* Week View */}
                {mode === "Week" && (
                    <View className="mt-5 border border-black-300 rounded-lg">
                        {weekSections.map((section, idx) => (
                            <View key={idx} className="flex-row items-center border-b border-black-300">
                                <View className="border-r border-black-300 max-w-16 w-full h-full flex-row items-center justify-center">
                                    <Text className="text-black">{section.title}</Text>
                                </View>
                                <View className="p-2.5 flex-1">
                                    {section.data.length === 0 ? (
                                        <Text className="text-black-400 text-sm">No slots</Text>
                                    ) : (
                                        section.data.map((slot, index) => (
                                            <View 
                                                key={slot.id} 
                                                className={index === section.data.length - 1 ? '' : 'mb-4'} 
                                            >
                                                <SlotCard slot={slot} />
                                            </View>
                                        ))
                                    )}
                                </View>
                            </View>
                        ))}
                    </View>
                )}

            </View>

        </ScrollView>
    );
}

export default Schedules