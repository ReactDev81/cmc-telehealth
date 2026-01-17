import Button from "@/components/ui/Button";
import { useAppointmentById } from "@/queries/patient/useAppointmentById";
import { router, useLocalSearchParams } from "expo-router";
import { Stethoscope } from "lucide-react-native";
import { useState } from "react";
import { Image, ScrollView, Text, View } from "react-native";

const AppointmentSummary = () => {
  const { bookingId } = useLocalSearchParams();
  const appointmentId = typeof bookingId === "string" ? bookingId : undefined;

  const { data, isLoading, isError } = useAppointmentById(appointmentId);


  const appointment = data?.data;
  const patient = appointment?.patient;
  const schedule = appointment?.schedule;
  const doctor = appointment?.doctor;
  const payment = appointment?.payment;

  //   const discountedValue = parseFloat(payment?.discount_formatted || '300');
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

  const handleDone = () => {
    setModalVisible(false);
    router.push("/(patient)");
  };

  const paymentData = () => {

    router.push({
      pathname: "/patient/razorpay",
      params: {
        amount: total,
        keyId: appointment?.razorpay_key_id,
        orderId: appointment?.razorpay_order_id,
        appointmentId: appointment?.id
      },
    });
  };

  //   console.log("KeyId :", appointment?.razorpay_key_id);
  //   console.log("orderId", appointment?.razorpay_order_id);

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="items-center mb-6">
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
            <View className="flex-row items-center justify-between">
              <Text className="text-sm text-black-400">Date</Text>
              <Text className="text-sm font-medium text-black-400">
                {schedule?.date_formatted}
              </Text>
            </View>
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
            {/* <View className="flex-row items-center justify-between mt-3">
                            <Text className="text-sm text-black-400">Booking For</Text>
                            <Text className="text-sm font-medium text-black-400">Self</Text>
                        </View> */}
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
        <View className="pb-5 mb-5">
          <Text className="text-lg text-black font-medium">Payment Detail</Text>
          <View className="mt-4">
            <View className="flex-row items-center justify-between">
              <Text className="text-sm text-black-400">Consultation Fee</Text>
              <Text className="text-sm font-medium text-black-400">
                {payment?.consultation_fee_formatted}
              </Text>
            </View>
            {/* <View className="flex-row items-center justify-between mt-3">
                            <Text className="text-sm text-black-400">Admin Fee</Text>
                            <Text className="text-sm font-medium text-black-400">{patient?.admin_fee_formatted}</Text>
                        </View> */}
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

        {/* book appointement with razorpay */}
        {/* <Button onPress={() => setModalVisible(true)}>Book Appointment ({total})</Button> */}

        <Button onPress={paymentData} variant="outline" className="mt-4">
          Book Appointment (₹{total})
        </Button>


        {/* <Button 
                  onPress={() => router.push('/patient/razorpay')}
                  variant="outline"
                  className="mt-4"
                >
                  Pay with Razorpay
                </Button> */}
      </View>

      {/* Appointement Confirmation Message */}
      {/* <AppointmentConfirmation visible={modalVisible} onClose={handleDone} /> */}
    </ScrollView>
  );
};

export default AppointmentSummary;
