// import { useLocalSearchParams } from "expo-router";
// import { Alert, Text, TouchableHighlight, View } from "react-native";
// import RazorpayCheckout from "react-native-razorpay";

// const Razorpay = () => {
//   const { amount, keyId, orderId } = useLocalSearchParams<{
//     amount?: string;
//     keyId?: string;
//     orderId?: string;
//   }>();

//   const handlePayment = () => {
//     const options = {
//       description: "Credits towards consultation",
//       image: require("../../assets/images/app-icon.png"),
//       currency: "INR",
//       key: keyId,
//       amount: amount, // Amount in paise (5000 paise = ₹50)
//       order_id: orderId,
//       name: "CMC Telehealth",
//       theme: { color: "#013220" },
//       // prefill: {
//       //   email: 'user@example.com',
//       //   contact: '9999999999',
//       //   name: 'John Doe'
//       // }
//     };

//     RazorpayCheckout.open(options)
//       .then((data) => {
//         console.log("Payment Success:", data);
//         Alert.alert("Success", `Payment ID: ${data.razorpay_payment_id}`);
//       })
//       .catch((error) => {
//         console.log("Payment Error:", error);
//         const errorMessage =
//           error.description || error.message || "Payment failed";
//         const errorCode = error.code || "UNKNOWN";
//         Alert.alert("Payment Failed", `${errorCode}: ${errorMessage}`);
//       });
//   };

//   return (
//     <View className="flex-1 items-center justify-center">
//       <TouchableHighlight onPress={handlePayment}>
//         <Text>Pay Now</Text>
//       </TouchableHighlight>
//     </View>
//   );
// };
// export default Razorpay;



import { useLocalSearchParams } from "expo-router";
import { Alert, Pressable, Text, View } from "react-native";
import RazorpayCheckout from "react-native-razorpay";
import appIcon from "../../assets/images/app-icon.png";

const Razorpay = () => {
  const { amount, keyId, orderId } = useLocalSearchParams<{
    amount?: string;
    keyId?: string;
    orderId?: string;
  }>();

  const handlePayment = () => {
    if (!amount || !keyId) {
      Alert.alert("Error", "Payment details missing");
      return;
    }

    const paymentAmount = Number(amount);
    if (isNaN(paymentAmount)) {
      Alert.alert("Error", "Invalid payment amount");
      return;
    }

    const options = {
      description: "Credits towards consultation",
      image: appIcon,
      currency: "INR",
      key: keyId,
      amount: amount, // paise
      order_id: orderId,
      name: "CMC Telehealth",
      theme: { color: "#013220" },
      handler: (response) => {
        console.log('payment response', response)
      }
    };

    RazorpayCheckout.open(options)
      .then((data) => {
        // Alert.alert("Success", `Payment ID: ${data.razorpay_payment_id}`);
        console.log("Success - Payment ID:", data);
      })
      .catch((error) => {
        // Alert.alert(
        //   "Payment Failed",
        //   `${error.code || "ERROR"}: ${
        //     error.description || error.message || "Something went wrong"
        //   }`
        // );
        console.log("error :", error);
      });
  };

  console.log({ amount, keyId, orderId })

  return (
    <View className="flex-1 items-center justify-center">
      <Pressable
        onPress={handlePayment}
        className="px-6 py-3 bg-green-700 rounded-lg"
      >
        <Text className="text-white font-semibold">Pay Now</Text>
      </Pressable>
    </View>
  );
};

export default Razorpay;
