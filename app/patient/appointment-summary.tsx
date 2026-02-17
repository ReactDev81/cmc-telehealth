import AppointmentConfirmation from "@/components/patient/appointment-summary/appointment-confirmation";
import PaymentFailedModal from "@/components/patient/appointment-summary/payment-failed";
import Button from "@/components/ui/Button";
import { useVerifyPayment } from "@/mutations/patient/useVerifyPayment";
import { useAppointmentById } from "@/queries/patient/useAppointmentById";
import { useQueryClient } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import { Stethoscope } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Alert, Image, ScrollView, Text, View } from "react-native";
import RazorpayCheckout from "react-native-razorpay";
import { SafeAreaView } from 'react-native-safe-area-context';

const AppointmentSummary = () => {

  const queryClient = useQueryClient();
  const { bookingId, isRescheduled } = useLocalSearchParams();

  // console.log('bookingId', bookingId)
  const appointmentId = typeof bookingId === "string" ? bookingId : undefined;
  // console.log('appointmentId', appointmentId);
  const { data, isLoading, isError, refetch } = useAppointmentById(appointmentId);

  // Refetch appointment data if coming from reschedule flow
  useEffect(() => {
    if (isRescheduled === "true" && appointmentId) {
      // Invalidate query cache and refetch to get updated rescheduled appointment data
      queryClient.invalidateQueries({
        queryKey: ["appointment", appointmentId],
      });
      refetch();
    }
  }, [isRescheduled, appointmentId, queryClient, refetch]);

  // Also refetch on initial load when appointmentId is set
  useEffect(() => {
    if (appointmentId) {
      refetch();
    }
  }, [appointmentId]);
  const [verifyData, setVerifyData] = useState([])

  const appointment = data?.data;
  const patient = appointment?.patient;
  const schedule = appointment?.schedule;
  const doctor = appointment?.doctor;
  const payment = appointment?.payment;
  // console.log("doctor name :", doctor?.name)

  // console.log('doctor', doctor?.user_id)
  // console.log('appointment data', appointment);
  // console.log('razorpay_key_id', appointment?.razorpay_key_id);

  const discountedValue = 0;

  const calculateAppointmentFee = () => {
    const consultationFee = parseFloat(
      payment?.consultation_fee_formatted?.replace(/[₹,\s]/g, "") || "0"
    );
    const discount = discountedValue;
    const total = Math.max(0, consultationFee - discount);
    return `${total}`;
  };

  const total = calculateAppointmentFee();

  const [modalVisible, setModalVisible] = useState(false);
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);

  const handleDone = () => {
    setModalVisible(false);
    router.push("/(patient)/appointments");
  };

  const handleTryAgain = () => {
    setPaymentModalVisible(false);
    router.push(`/patient/doctor/${doctor?.user_id}`);
  };

  const { mutate: verifyPayment } = useVerifyPayment();

  const handlePayment = () => {
    // Validate required Razorpay fields
    if (!appointment?.razorpay_key_id || !appointment?.razorpay_order_id) {
      Alert.alert("Error", "Payment information is not available. Please try again.");
      return;
    }

    // TypeScript now knows these are strings after the guard check
    const razorpayKeyId = appointment.razorpay_key_id;
    const razorpayOrderId = appointment.razorpay_order_id;

    const options = {
      // description: "Credits towards consultation",
      description: doctor?.name,
      image: require("../../assets/images/app-icon.png"),
      currency: "INR",
      key: razorpayKeyId,
      amount: total, // Amount in paise (5000 paise = ₹50)
      order_id: razorpayOrderId,
      name: "CMC Telehealth",
      theme: { color: "#013220" },
      // prefill: {
      //   email: 'user@example.com',
      //   contact: '9999999999',
      //   name: 'John Doe'
      // }
    };

    RazorpayCheckout.open(options)
      .then((data) => {
        // console.log("Payment Success:", data);

        if (!data?.razorpay_order_id || !data?.razorpay_payment_id || !appointment?.appointment_id || !data?.razorpay_signature) {
          // console.log("Payment Error: Missing required payment verification details");
          return;
        }

        verifyPayment(
          {
            razorpay_order_id: data.razorpay_order_id,
            razorpay_payment_id: data.razorpay_payment_id,
            appointment_id: appointment?.appointment_id,
            razorpay_signature: data.razorpay_signature
          },
          {
            onSuccess: (res) => {
              // Invalidate and refetch appointment to get updated data after payment
              queryClient.invalidateQueries({
                queryKey: ["appointment", appointmentId],
              });
              refetch();

              setModalVisible(true);
              setVerifyData(res?.data)
              // console.log("Verify Success Data:", res);
            },
            onError: (error: any) => {
              // console.log("Verify Failed Status:", error?.response?.status);
              // console.log("Verify Failed Data:", error?.response?.data);
            },
          }
        );

      })
      .catch((error) => {
        setPaymentModalVisible(true);
        // console.log("Payment Error:", error);
        const errorMessage =
          error.description || error.message || "Payment failed";
        const errorCode = error.code || "UNKNOWN";
        // Alert.alert("Payment Failed", `${errorCode}: ${errorMessage}`);
        // console.log('errorMessage', errorMessage);
        // console.log('errorCode', errorCode);

      });
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['left', 'right', 'bottom']}>
      <ScrollView className="flex-1">
        <View className="items-center">
          <Image
            source={{
              uri:
                appointment?.doctor?.avatar ||
                "https://cdn-icons-png.flaticon.com/512/387/387561.png",
            }}
            className="w-full h-60"
            resizeMode="cover"
          />
        </View>

        <View className="p-5 pb-12">
          {/* name & speciality */}
          <View className="pb-5 mb-5 border-b border-[#EDEDED]">
            <View className="flex-row gap-x-1">
              <Stethoscope size={15} color="#013220" />
              <Text className="text-primary text-sm">{doctor?.department}</Text>
            </View>
            <Text className="text-lg font-medium text-black mt-1">
              {doctor?.name}
            </Text>
          </View>

          {/* Appointment Details */}
          <View className="pb-5 mb-5 border-b border-[#EDEDED]">
            <Text className="text-lg text-black font-medium">
              Appointment Details
            </Text>
            <View className="mt-4">
              {/* <View className="flex-row items-center justify-between">
              <Text className="text-sm text-black-400">Date</Text>
              <Text className="text-sm font-medium text-black-400">
                {schedule?.date_formatted}
              </Text>
            </View> */}
              <Detail label="Date" value={schedule?.date_formatted} />
              <View className="flex-row items-center justify-between mt-3">
                <Text className="text-sm text-black-400">Time</Text>
                <Text className="text-sm font-medium text-black-400">
                  {schedule?.time_formatted}
                </Text>
              </View>
              <View className="flex-row items-center justify-between mt-3">
                <Text className="text-sm text-black-400">Booking Type</Text>
                <Text className="text-sm font-medium text-black-400">
                  {schedule?.consultation_type_label}
                </Text>
              </View>
            </View>
          </View>

          {/* Patient Details */}
          <View className="pb-5 mb-5 border-b border-[#EDEDED]">
            <Text className="text-lg text-black font-medium">Patient Age</Text>
            <View className="mt-4">
              <View className="flex-row items-center justify-between">
                <Text className="text-sm text-black-400">Patient Age</Text>
                <Text className="text-sm font-medium text-black-400">
                  {patient?.age}
                </Text>
              </View>
              <View className="flex-row items-center justify-between mt-3">
                <Text className="text-sm text-black-400">Gender</Text>
                <Text className="text-sm font-medium text-black-400">
                  {patient?.gender_formatted}
                </Text>
              </View>
              {patient?.allergies && (
                <View className="flex-row items-center justify-between mt-3">
                  <Text className="text-sm text-black-400">Allergies</Text>
                  <Text className="text-sm font-medium text-black-400">
                    {patient?.allergies}
                  </Text>
                </View>
              )}
              {patient?.problem && (
                <View className="flex-row items-center justify-between mt-3">
                  <Text className="text-sm text-black-400">Problem</Text>
                  <Text className="text-sm font-medium text-black-400">
                    {patient?.problem}
                  </Text>
                </View>
              )}
              <View className="flex-row justify-between mt-3">
                <View className="basis-2/5">
                  <Text className="text-sm text-black-400">Subject</Text>
                </View>
                <View className="basis-3/5">
                  <Text className="text-sm text-right text-nowrap font-medium text-black-400">
                    I've been neglecting my teeth care lately, and l'm not sure
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Payment Detail */}
          <View>
            <Text className="text-lg text-black font-medium">Payment Detail</Text>
            <View className="mt-4">
              <View className="flex-row items-center justify-between">
                <Text className="text-sm text-black-400">Consultation Fee</Text>
                <Text className="text-sm font-medium text-black-400">
                  {payment?.consultation_fee_formatted}
                </Text>
              </View>

              <View className="flex-row items-center justify-between mt-3">
                <Text className="text-sm text-black-400">Aditional Discount</Text>
                <Text className="text-sm font-medium text-black-400">
                  {discountedValue}
                </Text>
              </View>
              <View className="flex-row items-center justify-between mt-3">
                <Text className="text-sm text-black-400">Total</Text>
                <Text className="text-sm font-medium text-black-400">
                  {total}
                </Text>
              </View>
            </View>
          </View>

        </View>
      </ScrollView>

      {/* Sticky Button Footer */}
      {isRescheduled !== "true" && (
        <View className="p-5 bg-white border-t border-gray-200">
          <Button onPress={handlePayment}>
            Book Appointment (₹{total})
          </Button>
        </View>
      )}

      {/* Appointement Confirmation Message */}
      <AppointmentConfirmation visible={modalVisible} onClose={handleDone} data={verifyData} />

      {/* Payment Failed */}
      <PaymentFailedModal visible={paymentModalVisible} onClose={handleTryAgain} />

    </SafeAreaView>
  );
};

export default AppointmentSummary;

/* ---------------------- Reusable Row ---------------------- */
const Detail = ({ label, value }: { label: string; value?: string }) => (
  <View className="flex-row justify-between mt-3">
    <Text className="text-sm text-black-400">{label}</Text>
    <Text className="text-sm font-medium text-black-400">{value ?? ""}</Text>
  </View>
);