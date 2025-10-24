import { Link, router } from 'expo-router';
import { useState, useRef } from 'react';
import { View, Text, Pressable, Image, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function VerifyOTPScreen() {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [resendTimer, setResendTimer] = useState(54);
  const inputRefs = useRef<TextInput[]>([]);

  const handleOtpChange = (value: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSignIn = () => {
    const otpString = otp.join('');
    
    if (otpString.length < 6) {
      alert('Please enter complete OTP');
      return;
    }
    
    console.log('OTP entered:', otpString);
    
    // Here you would verify OTP with your API
    // For now, navigate to change password
    router.push('/auth/change-password');
  };

  const handleResendOTP = () => {
    console.log('Resending OTP...');
    setResendTimer(60);
    // Here you would call your API to resend OTP
  };

  return (
    <SafeAreaView className="flex-1 justify-center bg-white px-6">

      <View className='mb-6'>
        <Image source={require('../../assets/images/cmc-telehealth-logo.png')} className='w-24 h-24 mx-auto object-contain' />
        <Text className='text-base text-black text-center font-bold mt-1'>CMC Telehealth </Text>
      </View>

      <View className="mt-4">
        <Text className="text-black text-2xl font-bold text-center">Verify OTP</Text>
        <Text className="text-gray-500 mt-2 text-center px-4">
          Fill the OTP that we sent on your email.
        </Text>
      </View>

      <View className="mt-8">
        <View className="flex-row justify-center gap-3">
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => {
                if (ref) inputRefs.current[index] = ref;
              }}
              className="w-12 h-12 border border-gray-300 rounded-lg text-center text-lg font-semibold"
              value={digit}
              onChangeText={(value) => handleOtpChange(value, index)}
              onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
              keyboardType="numeric"
              maxLength={1}
              autoFocus={index === 0}
            />
          ))}
        </View>
      </View>

      <View className="mt-8">
        <Pressable
          onPress={handleSignIn}
          className="bg-[#2563EB] py-4 rounded-xl"
        >
          <Text className="text-white text-center text-base font-semibold">
            Sign In
          </Text>
        </Pressable>
      </View>

      <View className="mt-6 items-center">
        <Text className="text-gray-500 text-sm">
          Resend OTP in{' '}
          <Text className="text-[#2563EB] font-medium">00:{resendTimer.toString().padStart(2, '0')}</Text>
        </Text>
        
        <Pressable 
          onPress={handleResendOTP}
          className="mt-2"
          disabled={resendTimer > 0}
        >
          <Text className="text-[#2563EB] font-medium">
            Back to login
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}