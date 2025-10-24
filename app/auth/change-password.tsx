import { router } from 'expo-router';
import { useState } from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import PasswordInput from '../../components/form/password';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SetNewPasswordScreen() {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleChangePassword = () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      alert('Please fill all fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      alert('New passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      alert('Password must be at least 8 characters');
      return;
    }

    console.log('Changing password...', {
      oldPassword,
      newPassword,
      confirmPassword
    });
    
    // For now, show success and navigate back to login
    alert('Password changed successfully!');
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView className="flex-1 justify-center bg-white px-6">

      <View className='mb-6'>
        <Image source={require('../../assets/images/cmc-telehealth-logo.png')} className='w-24 h-24 mx-auto object-contain' />
        <Text className='text-base text-black text-center font-bold mt-1'>CMC Telehealth </Text>
      </View>

      <View className="mt-4">
        <Text className="text-black text-2xl font-bold text-center">Set New Password</Text>
        <Text className="text-gray-500 mt-2 text-center px-4">
          Enter your email to receive reset instructions
        </Text>
      </View>

      <View className="mt-8">
        <View className="mb-4">
          <PasswordInput
            label="Old Password"
            value={oldPassword}
            onChangeText={setOldPassword}
            placeholder="Enter Old password"
          />
        </View>

        <View className="mb-4">
          <PasswordInput
            label="New Password"
            value={newPassword}
            onChangeText={setNewPassword}
            placeholder="New Password"
          />
        </View>

        <View className="mb-6">
          <PasswordInput
            label="Confirm New Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Confirm New Password"
          />
        </View>
      </View>

      <View className="mt-8">
        <Pressable
          onPress={handleChangePassword}
          className="bg-[#2563EB] py-4 rounded-xl"
        >
          <Text className="text-white text-center text-base font-semibold">
            Change Password
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}