import { Link, router } from 'expo-router';
import { useState } from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import Input from '../../components/form/Input';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ResetPasswordScreen() {
  const [email, setEmail] = useState('');

  const handleSendInstructions = () => {
    if (!email) {
      alert('Please enter your email');
      return;
    }
    
    console.log('Reset password for:', email);
    
    router.push('/auth/verify-otp');
  };

  return (
    <SafeAreaView className="flex-1 justify-center bg-white px-6">

      <View className='mb-6'>
        <Image source={require('../../assets/images/cmc-telehealth-logo.png')} className='w-24 h-24 mx-auto object-contain' />
        <Text className='text-base text-black text-center font-bold mt-1'>CMC Telehealth </Text>
      </View>

      <View className="mt-4">
        <Text className="text-black text-2xl font-bold text-center">Reset Password</Text>
        <Text className="text-gray-500 mt-2 text-center px-4">
          Enter your email to receive reset instructions
        </Text>
      </View>

      <View className="mt-8">
        <Text className="text-sm text-gray-600 mb-2">Email</Text>
        <Input
          value={email}
          onChangeText={setEmail}
          inputMode="email"
          autoCapitalize="none"
          placeholder="example@email.com"
        />
      </View>

      <View className="mt-8">
        <Pressable
          onPress={handleSendInstructions}
          className="bg-[#2563EB] py-4 rounded-xl"
        >
          <Text className="text-white text-center text-base font-semibold">
            Sign In
          </Text>
        </Pressable>
      </View>

      <View className="mt-6">
        <Link href="/auth/login" asChild>
          <Pressable>
            <Text className="text-[#2563EB] text-center font-medium">
              Back to login
            </Text>
          </Pressable>
        </Link>
      </View>
    </SafeAreaView>
  );
}