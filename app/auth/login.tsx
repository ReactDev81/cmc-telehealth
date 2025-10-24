import { Link, router } from 'expo-router';
import { useState } from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import Button from '../../components/ui/Button';
import Input from '../../components/form/Input';
import PasswordInput from '../../components/form/password';
import Checkbox from '../../components/form/checkbox';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoginScreen() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);

  const handleSignIn = () => {
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView className="flex-1 justify-center bg-white px-6">
      
      <View className='mb-6'>
        <Image source={require('../../assets/images/cmc-telehealth-logo.png')} className='w-24 h-24 mx-auto object-contain' />
        <Text className='text-base text-black text-center font-bold mt-1'>CMC Telehealth </Text>
      </View>

      <View className="text-center">
        <Text className="text-black text-2xl font-bold text-center">Sign in to your account</Text>
        <Text className="text-black-400 mt-2 text-center">Welcome back! You have been missed.</Text>
      </View>

      <Input
        label="Email"
        value={email}
        onChangeText={setEmail}
        inputMode="email"
        autoCapitalize="none"
        placeholder="example@email.com"
        containerClassName="mt-8"
      />

      <View className="mt-4">
        <PasswordInput value={password} onChangeText={setPassword} />
      </View>

      <View className="mt-8 flex-row items-center justify-between">
        <Checkbox checked={remember} onChange={setRemember} label="Remember for 30 days" />
        <Link href="/auth/reset-password" className="text-[#D70015] text-sm font-semibold">
          Forgot Password?
        </Link>
      </View>

      <View className="mt-8">
        <Button variant="filled" onPress={handleSignIn}>Sign In</Button>

        <View className="flex-row items-center mt-7">
          <View className="flex-1 h-px bg-primary-200" />
          <Text className="mx-3 text-black-400 text-base">or Sign In with</Text>
          <View className="flex-1 h-px bg-primary-200" />
        </View>

        <Pressable className="mt-7 border border-[#D0D5DD] py-3.5 rounded-xl flex-row justify-center items-center gap-x-4">
          <Image source={require('../../assets/images/google.png')}></Image>
          <Text className="text-black-400">Sign in with Google</Text>
        </Pressable>
      </View>

      <View className="mt-10 items-center">
        <Text className="text-black-400">
          Don’t have an account?
          <Link href="/auth/signup">
            <Text className="text-primary font-medium"> Sign Up</Text>
          </Link>
        </Text>
      </View>
    </SafeAreaView>
  );
}