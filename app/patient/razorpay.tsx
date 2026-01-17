import { useVerifyPayment } from "@/mutations/patient/useVerifyPayment";
import { router, useLocalSearchParams } from "expo-router";
import { Text, TouchableHighlight, View } from "react-native";
import RazorpayCheckout from "react-native-razorpay";

const Razorpay = () => {
  const { amount, keyId, orderId, appointmentId } = useLocalSearchParams<{
    amount?: string;
    keyId?: string;
    orderId?: string;
    appointmentId?: string
  }>();

  console.log('appointmentId', appointmentId)

  const { mutate: verifyPayment } = useVerifyPayment();

  const handlePayment = () => {

    if (!keyId || !amount || !orderId) {
      console.log("Payment Error: Missing required payment details");
      return;
    }

    const options = {
      description: "Credits towards consultation",
      image: require("../../assets/images/app-icon.png"),
      currency: "INR",
      key: keyId,
      amount: amount, // Amount in paise (5000 paise = ₹50)
      order_id: orderId,
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
        console.log("Payment Success:", data);
        // Alert.alert("Success", `Payment ID: ${data.razorpay_payment_id}`);

        if (!data?.razorpay_order_id || !data?.razorpay_payment_id || !appointmentId || !data?.razorpay_signature) {
          console.log("Payment Error: Missing required payment verification details");
          return;
        }

        verifyPayment(
          {
            razorpay_order_id: data.razorpay_order_id,
            razorpay_payment_id: data.razorpay_payment_id,
            appointment_id: appointmentId,
            razorpay_signature: data.razorpay_signature
          },
          {
            onSuccess: (res) => {
              console.log("Verify Success:", res);
              // ✅ navigate / show success screen
              router.replace("/(patient)/appointments");
            },
            onError: (error: any) => {
              console.log("Verify Failed Status:", error?.response?.status);
              console.log("Verify Failed Data:", error?.response?.data);
            },
          }
        );

      })
      .catch((error) => {
        console.log("Payment Error:", error);
        const errorMessage =
          error.description || error.message || "Payment failed";
        const errorCode = error.code || "UNKNOWN";
        // Alert.alert("Payment Failed", `${errorCode}: ${errorMessage}`);
        console.log('errorMessage', errorMessage);
        console.log('errorCode', errorCode);
      });
  };

  return (
    <View className="flex-1 items-center justify-center">
      <TouchableHighlight onPress={handlePayment}>
        <Text>Pay Now</Text>
      </TouchableHighlight>
    </View>
  );
};
export default Razorpay;