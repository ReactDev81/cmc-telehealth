import { useBookAppointment } from "@/mutations/patient/useBookAppointment";
import { useRescheduleAppointment } from "@/mutations/patient/useRescheduleAppointment";
import { useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Modal, Pressable, ScrollView, Text, TouchableOpacity, View } from "react-native";
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
    id?: string;
    availability?: AvailabilityDay[];
  } | null;
  appointmentType?: "video" | "in_person" | null;
  opdType?: "general" | "private" | null;
  bookingType?: string;
  appointmentIdToReschedule?: string;
  initialSelectedDate?: string | null;
  initialSelectedTime?: string | null;
  canReschedule?: boolean;
  appointmentStatus?: string;
};

const DoctorSchedule = ({ doctorData, appointmentType, opdType, bookingType, appointmentIdToReschedule, initialSelectedDate, initialSelectedTime, canReschedule, appointmentStatus }: DoctorScheduleProps) => {

  const queryClient = useQueryClient();
  const availability = doctorData?.availability ?? [];
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [rescheduleError, setRescheduleError] = useState<string | null>(null);
  const { mutate: submitBooking, isPending } = useBookAppointment();
  const { mutate: submitReschedule, isPending: isReschedulePending } = useRescheduleAppointment();
  const [resultModalVisible, setResultModalVisible] = useState(false);
  const [resultModalMessage, setResultModalMessage] = useState<string | null>(null);
  const [resultModalSuccess, setResultModalSuccess] = useState<boolean | null>(null);
  const [resultRouteParams, setResultRouteParams] = useState<any>(null);

  /** Auto-select first available date */
  useEffect(() => {
    if (availability.length > 0) {
      // if initialSelectedDate provided and exists in availability, select it
      if (initialSelectedDate) {
        const exists = availability.some((d) => d.date === initialSelectedDate);
        if (exists) {
          setSelectedDate(initialSelectedDate);
          return;
        }
      }

      if (!selectedDate) setSelectedDate(availability[0].date);
    }
  }, [availability]);

  // If initialSelectedTime is provided, try to select the matching slot on the selected date
  useEffect(() => {
    if (!initialSelectedTime || !selectedDate) return;

    const daySlots = availability.find((d) => d.date === selectedDate)?.slots ?? [];
    const match = daySlots.find((s) => s.booking_start_time === initialSelectedTime);
    if (match) {
      setSelectedSlotId(match.id);

      const booking: BookingData = {
        id: match.id,
        doctor_id: doctorData?.id ?? "",
        availability_id: match.id,
        appointment_date: match.date || selectedDate || "",
        appointment_time: match.booking_start_time,
        consultation_type: match.consultation_type,
        opd_type: match.opd_type || null,
        consultation_fee: match.consultation_fee,
      };

      setBookingData(booking);
    }
  }, [initialSelectedTime, selectedDate, availability]);

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
      doctor_id: doctorData?.id ?? "",
      availability_id: slot.id,
      appointment_date: slot.date || selectedDate || "",
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

    // Check if reschedule is allowed
    if (bookingType === "reschedule") {
      if (!canReschedule) {
        setRescheduleError("This appointment cannot be rescheduled. Only confirmed appointments can be rescheduled.");
        return;
      }
      if (appointmentStatus && appointmentStatus !== "confirmed") {
        setRescheduleError(`Cannot reschedule: Appointment status is "${appointmentStatus}". Only confirmed appointments can be rescheduled.`);
        return;
      }
    }

    const payload: any = {
      doctor_id: bookingData.doctor_id,
      availability_id: bookingData.availability_id,
      appointment_date: bookingData.appointment_date,
      appointment_time: bookingData.appointment_time ?? "",
      consultation_type: bookingData.consultation_type,
      opd_type: bookingData.opd_type,
      consultation_fee: bookingData.consultation_fee,
    };

    console.log("Booking Data:", payload);

    // Handle reschedule vs new booking
    if (bookingType === "reschedule" && appointmentIdToReschedule) {
      // For reschedule: old appointment ID + new availability ID
      payload.appointment_id = appointmentIdToReschedule;
      // availability_id already in payload from bookingData

      submitReschedule(
        {
          appointmentId: appointmentIdToReschedule,
          payload,
        },
        {
          onSuccess: (response) => {
            console.log("Reschedule Success:", response);
            setRescheduleError(null);

            // Invalidate appointment queries to refresh data
            queryClient.invalidateQueries({
              queryKey: ["appointment"],
            });

            // Prepare route params to navigate after user dismisses modal
            const params = {
              pathname: "/patient/appointment-summary",
              params: {
                bookingId: response?.data?.appointment_id,
                isRescheduled: "true",
                rescheduleMessage: String(response?.message ?? ""),
                feeChanged: String(response?.fee_changed ?? "false"),
                oldFee: String(response?.old_fee ?? ""),
                newFee: String(response?.new_fee ?? ""),
                schedule_date: String(response?.data?.schedule?.date_formatted ?? ""),
                schedule_time: String(response?.data?.schedule?.time_formatted ?? ""),
                doctor_avatar: String(response?.data?.doctor?.avatar ?? ""),
                doctor_name: String(response?.data?.doctor?.name ?? ""),
                doctor_department: String(response?.data?.doctor?.department ?? ""),
                consultation_type_label: String(response?.data?.schedule?.consultation_type_label ?? ""),
              },
            };

            setResultRouteParams(params);
            setResultModalMessage(response?.message ?? "Appointment rescheduled successfully.");
            setResultModalSuccess(true);
            setResultModalVisible(true);
          },
          onError: (error: any) => {
            console.log("Reschedule Error (Raw):", error);
            console.log("Reschedule Error Data:", JSON.stringify(error?.response?.data, null, 2));

            const errorData = error?.response?.data;
            let errorMsg = "Failed to reschedule appointment. Please try again.";

            if (errorData) {
              if (errorData.errors) {
                // Extracts the first validation error from any field (e.g., appointment_date)
                const firstKey = Object.keys(errorData.errors)[0];
                const firstError = errorData.errors[firstKey];
                if (Array.isArray(firstError)) {
                  errorMsg = firstError[0];
                } else if (typeof firstError === "string") {
                  errorMsg = firstError;
                }
              } else if (errorData.message) {
                errorMsg = errorData.message;
              }
            } else if (error.message) {
              errorMsg = error.message;
            }

            setRescheduleError(errorMsg);
            setResultModalMessage(errorMsg);
            setResultModalSuccess(false);
            setResultModalVisible(true);
          },
        }
      );
    } else {
      payload.booking_type = "new";

      submitBooking(payload, {
        onSuccess: (response) => {
          // console.log("Booking Success:", response);
          // console.log("bookingId:", response?.data?.appointment?.id);

          // Invalidate appointment queries to refresh data
          queryClient.invalidateQueries({
            queryKey: ["appointment"],
          });

          router.replace({
            pathname: "/patient/appointment-summary",
            params: {
              bookingId: response?.data?.appointment?.id,
            },
          });
        },
        onError: (error: any) => {
          console.log("Booking Error (Raw):", error);
          console.log("Booking Error Data:", JSON.stringify(error?.response?.data, null, 2));

          const errorData = error?.response?.data;
          let errorMsg = "Failed to book appointment. Please try again.";

          if (errorData) {
            if (errorData.errors) {
              // Extracts the first validation error from any field (e.g., appointment_date)
              const firstKey = Object.keys(errorData.errors)[0];
              const firstError = errorData.errors[firstKey];
              if (Array.isArray(firstError)) {
                errorMsg = firstError[0];
              } else if (typeof firstError === "string") {
                errorMsg = firstError;
              }
            } else if (errorData.message) {
              errorMsg = errorData.message;
            }
          } else if (error.message) {
            errorMsg = error.message;
          }

          setResultModalMessage(errorMsg);
          setResultModalSuccess(false);
          setResultModalVisible(true);
        },
      });
    }
  };

  return (
    <View className="mt-7">
      {/* Header */}
      {selectedDate && (
        <View className="flex-row justify-between items-center">
          <Text className="text-lg font-medium text-black">Select Schedules</Text>
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
                className={`items-center justify-center w-11 h-11 rounded-md ${isActive ? "bg-primary" : "bg-gray-100"
                  }`}
              >
                <Text
                  className={`text-base font-medium ${isActive ? "text-white" : "text-black-400"
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
                className={`p-2.5 rounded ${isSelected
                  ? "bg-primary"
                  : slot.available
                    ? "bg-white"
                    : "bg-gray-200"
                  }`}
                style={{ width: "48%" }}
              >
                <Text
                  className={`text-xs font-medium text-center ${isSelected
                    ? "text-white"
                    : slot.available
                      ? "text-black-400"
                      : "text-gray-400"
                    }`}
                >
                  {slot.start_time} – {slot.end_time}
                </Text>

                <Text
                  className={`text-[10px] text-center mt-0.5 ${isSelected ? "text-white" : "text-black"
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

      {/* Error message for reschedule validation */}
      {rescheduleError && (
        <View className="mt-5 p-3 bg-red-100 rounded border border-red-300">
          <Text className="text-sm text-red-700">{rescheduleError}</Text>
        </View>
      )}

      {/* Reschedule result modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={resultModalVisible}
        onRequestClose={() => setResultModalVisible(false)}
      >
        <Pressable
          className="flex-1 bg-black/60 justify-center items-center"
          onPress={() => setResultModalVisible(false)}
        >
          <Pressable
            className="bg-white rounded-xl p-6 mx-5 w-full max-w-sm"
            onPress={(e) => e.stopPropagation()}
          >
            <Text className="text-lg font-semibold text-center text-black mb-2">
              {resultModalSuccess ? "Success" : "Failed"}
            </Text>

            <Text className="text-base text-black-400 text-center mb-6">
              {resultModalMessage}
            </Text>

            <Button
              onPress={() => {
                setResultModalVisible(false);
                if (resultModalSuccess && resultRouteParams) {
                  router.replace(resultRouteParams);
                }
              }}
              className="mx-auto px-8"
            >
              OK
            </Button>
          </Pressable>
        </Pressable>
      </Modal>

      {/* CTA */}
      <Button
        className="mt-8"
        disabled={!selectedSlotId || !bookingData || isPending || isReschedulePending || (bookingType === "reschedule" && !canReschedule)}
        onPress={handleBooking}
      >
        {isPending || isReschedulePending
          ? (bookingType === "reschedule" ? "Rescheduling..." : "Booking...")
          : selectedSlot
            ? (bookingType === "reschedule"
              ? "Reschedule Appointment"
              : `Book Appointment (₹${parseFloat(selectedSlot.consultation_fee).toFixed(2)})`)
            : (bookingType === "reschedule" ? "Reschedule Appointment" : "Book Appointment")}
      </Button>
    </View>
  );
};

export default DoctorSchedule;
