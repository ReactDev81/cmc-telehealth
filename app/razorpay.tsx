import { View, Text, TouchableHighlight, Alert } from 'react-native';
import RazorpayCheckout from 'react-native-razorpay';

const Razorpay = () => {
  
  const handlePayment = () => {
    
    const options = {
      description: 'Credits towards consultation',
      image: 'https://i.imgur.com/3g7nmJC.jpg',
      currency: 'INR',
      key: 'rzp_test_RFSYJz0YVJmNnY',
      amount: '5000', // Amount in paise (5000 paise = ₹50)
      name: 'Acme Corp',
      theme: { color: '#53a20e' },
      prefill: {
        email: 'user@example.com',
        contact: '9999999999',
        name: 'John Doe'
      }
    };

    RazorpayCheckout.open(options)
      .then(data => {
        console.log('Payment Success:', data);
        Alert.alert('Success', `Payment ID: ${data.razorpay_payment_id}`);
      })
      .catch(error => {
        console.log('Payment Error:', error);
        const errorMessage = error.description || error.message || 'Payment failed';
        const errorCode = error.code || 'UNKNOWN';
        Alert.alert('Payment Failed', `${errorCode}: ${errorMessage}`);
      });
  };

  return (
    <View className="flex-1 items-center justify-center">
      <TouchableHighlight onPress={handlePayment}>
        <Text>Pay Now</Text>
      </TouchableHighlight>
    </View>
  );
}
export default Razorpay