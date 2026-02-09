import Segmented from "@/components/doctor/my-schedule/segmented";
import SlotCard from "@/components/doctor/my-schedule/slot-card";
import { useAuth } from "@/context/UserContext";
import { useGetDoctorSchedule } from "@/queries/doctor/useSchedule";
import { Slot } from "@/types/doctor/schedule";
import { addDays, addWeeks, eachDayOfInterval, endOfWeek, format, startOfWeek } from "date-fns";
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { useCallback, useMemo, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, Text, TextStyle, TouchableOpacity, View } from "react-native";
import type { DateData } from "react-native-calendars";
import { Calendar } from "react-native-calendars";

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

type ViewMode = "Day" | "Week" | "Month";

const Schedules = () => {

    const [mode, setMode] = useState<ViewMode>("Month");
    const [selectedDate, setSelectedDate] = useState<string>(format(new Date(), "yyyy-MM-dd"));
    const { token } = useAuth();

    const { data: scheduleData, isLoading, isError, error } = useGetDoctorSchedule(selectedDate, mode.toLowerCase(), token!);

    console.log("[UI] Schedules token:", token ? "Exists" : "Missing");
    console.log("📅 Schedule Data for", selectedDate, ":", JSON.stringify(scheduleData, null, 2));

    const slots: Slot[] = useMemo(() => {
        if (!scheduleData) return [];

        const extract = (obj: any, parentDate?: string): Slot[] => {
            if (!obj) return [];
            if (Array.isArray(obj)) {
                return obj.flatMap(item => extract(item, parentDate));
            }

            const currentDate = obj.date || parentDate;

            // Direct slots array
            if (obj.slots && Array.isArray(obj.slots)) {
                return obj.slots.map((s: any) => ({
                    ...s,
                    date: s.date || currentDate // Inject date if missing
                }));
            }

            // availability array
            if (obj.availability && Array.isArray(obj.availability)) {
                return extract(obj.availability, currentDate);
            }

            // Standard wrappers
            for (const key of ['list', 'items', 'data']) {
                if (obj[key]) return extract(obj[key], currentDate);
            }

            // Fallback: Check all keys (handles object-key dates)
            let results: Slot[] = [];
            let foundSlots = false;
            for (const key in obj) {
                if (obj[key] && typeof obj[key] === 'object') {
                    const nextDate = /^\d{4}-\d{2}-\d{2}$/.test(key) ? key : currentDate;
                    const extracted = extract(obj[key], nextDate);
                    if (extracted.length > 0) {
                        results = results.concat(extracted);
                        foundSlots = true;
                    }
                }
            }
            return results;
        };

        return extract(scheduleData);
    }, [scheduleData]);

    // Memoize calendar marks
    const marked = useMemo(() => {
        const marks: Record<string, any> = {};
        marks[selectedDate] = { selected: true };

        slots.forEach(s => {
            const k = s.date;
            marks[k] = { ...(marks[k] || {}), marked: true };
        });
        return marks;
    }, [selectedDate, slots]);

    // Day slots
    const daySlots = useMemo(
        () => slots.filter(s => s.date === selectedDate),
        [slots, selectedDate]
    );

    // Week calculation
    const currentSelectedDate = useMemo(() => new Date(selectedDate), [selectedDate]);

    const weekDays = useMemo(() => {
        const weekStart = startOfWeek(currentSelectedDate, { weekStartsOn: 1 });
        const weekEnd = endOfWeek(currentSelectedDate, { weekStartsOn: 1 });
        return eachDayOfInterval({ start: weekStart, end: weekEnd });
    }, [currentSelectedDate]);

    const weekSections = useMemo(() => {
        return weekDays.map(d => {
            const dStr = format(d, "yyyy-MM-dd");
            return {
                title: format(d, "EEE"),
                data: slots.filter(s => s.date === dStr),
                date: d,
            };
        });
    }, [weekDays, slots]);

    // Navigation handlers
    const handlePrevious = useCallback(() => {
        const d = new Date(selectedDate);
        if (mode === "Day") {
            setSelectedDate(format(addDays(d, -1), "yyyy-MM-dd"));
        } else if (mode === "Week") {
            setSelectedDate(format(addWeeks(d, -1), "yyyy-MM-dd"));
        } else {
            setSelectedDate(format(addDays(d, -1), "yyyy-MM-dd"));
        }
    }, [mode, selectedDate]);

    const handleNext = useCallback(() => {
        const d = new Date(selectedDate);
        if (mode === "Day") {
            setSelectedDate(format(addDays(d, 1), "yyyy-MM-dd"));
        } else if (mode === "Week") {
            setSelectedDate(format(addWeeks(d, 1), "yyyy-MM-dd"));
        } else {
            setSelectedDate(format(addDays(d, 1), "yyyy-MM-dd"));
        }
    }, [mode, selectedDate]);

    // Date display text
    const dateDisplay = useMemo(() => {
        const d = new Date(selectedDate);
        if (mode === "Week") {
            const weekStart = startOfWeek(d, { weekStartsOn: 1 });
            const weekEnd = endOfWeek(d, { weekStartsOn: 1 });
            return `${format(weekStart, "MMM d")} - ${format(weekEnd, "MMM d, yyyy")}`;
        }
        return format(d, "dd MMMM, yyyy");
    }, [selectedDate, mode]);

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

                {(isLoading || !token) && (
                    <View className="mt-10 items-center">
                        <ActivityIndicator color="#013220" />
                        <Text className="mt-2 text-neutral-500">{!token ? "Authenticating..." : "Loading schedule..."}</Text>
                    </View>
                )}

                {isError && (
                    <View className="mt-10 items-center">
                        <Text className="text-red-500">Failed to load schedule</Text>
                        <Text className="text-neutral-500 text-xs mt-1">{(error as any)?.message}</Text>
                    </View>
                )}

                {!isLoading && !isError && (
                    <>
                        {/* Month View */}
                        {mode === "Month" && (
                            <View className="mt-5">
                                <Calendar
                                    key={selectedDate}
                                    current={selectedDate}
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
                                    onDayPress={(d: DateData) => setSelectedDate(d.dateString)}
                                    onMonthChange={(m: DateData) => setSelectedDate(m.dateString)}
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
                    </>
                )}

            </View>

        </ScrollView>
    );
}

export default Schedules
