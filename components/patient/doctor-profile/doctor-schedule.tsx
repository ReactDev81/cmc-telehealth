import { useBookAppointment } from "@/mutations/patient/useBookAppointment";
import { router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import Button from "../../ui/Button";

type BookingData = {
  id: string;
  doctor_id: string;
  availability_id: string;
  appointment_date: string;
  appointment_time?: string;
  consultation_type: "video" | "in-person";
  opd_type: "general" | "private" | null;
  consultation_fee: string;
};

type Slot = {
  id: string;
  date: string;
  start_time: string;
  end_time: string;
  booking_start_time?: string;
  consultation_type: "video" | "in-person";
  opd_type?: "general" | "private";
  available: boolean;
  booked_count: number;
  consultation_fee: string;
};

type AvailabilityDay = {
  date: string;
  slots: Slot[];
};

type DoctorScheduleResponse = {
  success: boolean;
  data: {
    id: string;
    availability: AvailabilityDay[];
  };
};

type DoctorScheduleProps = {
  doctorData?: {
    data: {
      id?: string;
      availability?: AvailabilityDay[];
    };
  } | null;
  appointmentType?: "video" | "in_person" | null;
  opdType?: "general" | "private" | null;
};

const DoctorSchedule = ({ doctorData, appointmentType, opdType }: DoctorScheduleProps) => {

  const availability = doctorData?.data?.availability ?? [];
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const { mutate: submitBooking, isPending } = useBookAppointment();

  // console.log('booking', bookingData);

  /** Auto-select first available date */
  useEffect(() => {
    if (availability.length > 0 && !selectedDate) {
      setSelectedDate(availability[0].date);
    }
  }, [availability]);

  const parseDate = (date: string) => new Date(date);

  const getDayName = (date: string) =>
    ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][parseDate(date).getDay()];

  const getMonthYear = (date: string) =>
    parseDate(date).toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });

  /** Slots for selected date */
  const slots = useMemo(() => {
    const daySlots =
      availability.find((d) => d.date === selectedDate)?.slots ?? [];

    // If no appointment type is selected, show all slots
    if (!appointmentType) {
      return daySlots;
    }

    // Filter by appointment type
    return daySlots.filter((slot) => {
      if (appointmentType === "video") {
        return slot.consultation_type === "video";
      } else if (appointmentType === "in_person") {
        // For in-person appointments, also filter by OPD type if specified
        if (opdType) {
          return (
            slot.consultation_type === "in-person" && slot.opd_type === opdType
          );
        }
        return slot.consultation_type === "in-person";
      }
      return true;
    });
  }, [availability, selectedDate, appointmentType, opdType]);

  /** Get selected slot details */
  const selectedSlot = useMemo(() => {
    return slots.find((slot) => slot.id === selectedSlotId);
  }, [slots, selectedSlotId]);

  /** Handle slot selection and prepare booking data */
  const handleSlotSelection = (slot: Slot) => {
    setSelectedSlotId(slot.id);

    // Prepare booking data
    const booking: BookingData = {
      id: slot.id,
      doctor_id: doctorData?.data?.id ?? "",
      availability_id: slot.id,
      appointment_date: slot.date,
      appointment_time: slot.booking_start_time,
      consultation_type: slot.consultation_type,
      opd_type: slot.opd_type || null,
      consultation_fee: slot.consultation_fee,
    };

    setBookingData(booking);
  };

  /** Loading */
  // if (loading) {
  //     return (
  //         <View className="mt-10 items-center">
  //             <ActivityIndicator size="large" />
  //         </View>
  //     );
  // }

  /** Error */
  // if (error) {
  //     return (
  //         <Text className="text-red-500 mt-5">
  //             Failed to load schedule
  //         </Text>
  //     );
  // }

  const handleBooking = () => {
    if (!bookingData) return;

    submitBooking(
      {
        doctor_id: bookingData.doctor_id,
        availability_id: bookingData.availability_id,
        appointment_date: bookingData.appointment_date,
        appointment_time: bookingData.appointment_time ?? "",
        consultation_type: bookingData.consultation_type,
        opd_type: bookingData.opd_type,
        consultation_fee: bookingData.consultation_fee,
      },
      {
        onSuccess: (response) => {
          console.log("Booking Success:", response);
          console.log('bookingId:', response?.data?.appointment?.id)
          router.replace({
            pathname: "/patient/appointment-summary",
            params: {
              bookingId: response?.data?.appointment?.id,
            },
          });
        },
        onError: (error: any) => {
          console.log("Booking Failed:", error?.response?.data || error);
          console.log('Booking Error', error)
        },
      }
    );
  };

  return (
    <View className="mt-7">
      {/* Header */}
      {selectedDate && (
        <View className="flex-row justify-between items-center">
          <Text className="text-lg font-medium text-black">Schedules</Text>
          <Text className="text-sm text-black-400 font-medium">
            {getMonthYear(selectedDate)}
          </Text>
        </View>
      )}

      {/* Dates */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 10 }}
        className="mt-5"
      >
        {availability.map((day) => {
          const isActive = day.date === selectedDate;

          return (
            <View key={day.date}>
              <TouchableOpacity
                onPress={() => {
                  setSelectedDate(day.date);
                  setSelectedSlotId(null);
                }}
                className={`items-center justify-center w-11 h-11 rounded-md ${
                  isActive ? "bg-primary" : "bg-gray-100"
                }`}
              >
                <Text
                  className={`text-base font-medium ${
                    isActive ? "text-white" : "text-black-400"
                  }`}
                >
                  {parseDate(day.date).getDate()}
                </Text>
              </TouchableOpacity>

              <Text className="text-sm text-black-400 text-center mt-1">
                {getDayName(day.date)}
              </Text>
            </View>
          );
        })}
      </ScrollView>

      {/* Time Slots */}
      <View className="bg-primary-100 rounded-xl p-4 mt-6">
        <View className="flex-row flex-wrap gap-y-3 justify-between">
          {slots.length === 0 && (
            <Text className="text-sm text-black-400">No slots available</Text>
          )}

          {slots.map((slot) => {
            const isSelected = selectedSlotId === slot.id;

            return (
              <TouchableOpacity
                key={slot.id}
                disabled={!slot.available}
                onPress={() => handleSlotSelection(slot)}
                className={`p-2.5 rounded ${
                  isSelected
                    ? "bg-primary"
                    : slot.available
                    ? "bg-white"
                    : "bg-gray-200"
                }`}
                style={{ width: "48%" }}
              >
                <Text
                  className={`text-xs font-medium text-center ${
                    isSelected
                      ? "text-white"
                      : slot.available
                      ? "text-black-400"
                      : "text-gray-400"
                  }`}
                >
                  {slot.start_time} – {slot.end_time}
                </Text>

                <Text
                  className={`text-[10px] text-center mt-0.5 ${
                    isSelected ? "text-white" : "text-gray-400"
                  }`}
                >
                  {slot.consultation_type}
                  {slot.opd_type && ` (${slot.opd_type})`}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* CTA */}
      <Button
        className="mt-8"
        disabled={!selectedSlotId || !bookingData}
        onPress={handleBooking}
      >
        {isPending
          ? "Booking..."
          : selectedSlot
          ? `Book Appointment (₹${parseFloat(
              selectedSlot.consultation_fee
            ).toFixed(2)})`
          : "Book Appointment"}
      </Button>
    </View>
  );
};

export default DoctorSchedule;
