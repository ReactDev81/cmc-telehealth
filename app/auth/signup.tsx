import { Link, router } from 'expo-router';
import { useState } from 'react';
import { View, Text, Pressable, Image, ScrollView } from 'react-native';
import Input from '../../components/form/Input';
import PasswordInput from '../../components/form/password';
import Checkbox from '../../components/form/checkbox';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RegisterScreen() {
  const [step, setStep] = useState(1);
  
  // Step 1 - Account Details
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  
  // Step 2 - Basic Information
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState({
    month: '',
    day: '',
    year: ''
  });
  const [phoneNumber, setPhoneNumber] = useState('');
  const [gender, setGender] = useState('');

  const handleContinueStep1 = () => {
    
    console.log('Continue pressed', { email, password, agreedToTerms });
    
    if (email && password && agreedToTerms) {
      if (password.length < 8) {
        alert('Password must be at least 8 characters');
        return;
      }
      setStep(2);
    } else {
      alert('Please fill all fields and agree to terms');
    }
  };

  const handleContinueStep2 = () => {
    // Add validation and registration logic here
    console.log('Registration completed', {
      email,
      password,
      firstName,
      lastName,
      dateOfBirth,
      phoneNumber,
      gender
    });
    
    // Validate required fields
    if (firstName && lastName && phoneNumber && gender) {
      router.replace('/(tabs)');
    } else {
      alert('Please fill all required fields');
    }
  };

  const renderPasswordStrength = () => {
    const strength = password.length;
    const bars = Array.from({ length: 4 }, (_, i) => (
      <View
        key={i}
        className={`h-1 flex-1 mx-0.5 rounded ${
          i < strength / 2 ? 'bg-primary' : 'bg-gray-200'
        }`}
      />
    ));
    
    return (
      <View className="mt-2">
        <Text className="text-xs text-gray-600 mb-1">Password strength:</Text>
        <View className="flex-row">{bars}</View>
      </View>
    );
  };

  if (step === 1) {
    return (
      <SafeAreaView className="flex-1 justify-center bg-white px-6">

        <View className='mb-6'>
          <Image source={require('../../assets/images/cmc-telehealth-logo.png')} className='w-24 h-24 mx-auto object-contain' />
          <Text className='text-base text-black text-center font-bold mt-1'>CMC Telehealth </Text>
        </View>

        <View className="mt-4">
          <Text className="text-black text-2xl font-bold text-center">Create an account</Text>
          <Text className="text-gray-500 mt-2 text-center">Let's get you started. Please enter your details</Text>
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
          <PasswordInput 
            value={password} 
            onChangeText={setPassword}
            placeholder="8 characters minimum"
          />
          {password && renderPasswordStrength()}
        </View>

        <View className="mt-8">
          <Checkbox 
            checked={agreedToTerms} 
            onChange={setAgreedToTerms} 
            label=""
          />
          <Text className="text-gray-600 text-sm ml-6 -mt-5">
            By clicking "Continue", you agree to accept our{' '}
            <Text className="text-primary font-medium">Privacy Policy</Text>
            {' '}and{' '}
            <Text className="text-primary font-medium">Terms of Service</Text>
          </Text>
        </View>

        <View className="mt-8">
          <Pressable
            onPress={handleContinueStep1}
            className="bg-[#2563EB] py-4 rounded-xl"
          >
            <Text className="text-white text-center text-base font-semibold">
              Continue
            </Text>
          </Pressable>
        </View>

        <View className="mt-10 items-center">
          <Text className="text-gray-500">
            Already have an account?{' '}
            <Link href="/auth/login">
              <Text className="text-primary font-medium">Sign In</Text>
            </Link>
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white px-6">
      <ScrollView showsVerticalScrollIndicator={false}>
        
        <View className="flex-row justify-between items-center mt-4">
          <Pressable onPress={() => setStep(1)}>
            <Text className="text-primary text-sm">← Back</Text>
          </Pressable>
          <Text className="text-gray-500 text-sm">Sign Up</Text>
        </View>

        <View className="mt-8">
          <Text className="text-black text-2xl font-bold">Basic Information</Text>
          <Text className="text-gray-500 mt-2 text-center">
            Please tell us some basic information to complete your profile:
          </Text>
        </View>

        <Input
          label="First Name"
          value={firstName}
          onChangeText={setFirstName}
          placeholder="First Name"
          containerClassName="mt-8"
          left={<Text className="text-gray-400">👤</Text>}
        />

        <Input
          label="Last Name"
          value={lastName}
          onChangeText={setLastName}
          placeholder="Last Name"
          containerClassName="mt-4"
          left={<Text className="text-gray-400">👤</Text>}
        />

        <View className="mt-4">
          <Text className="text-sm text-primary-400 mb-2">Date of birth</Text>
          <View className="flex-row gap-2">
            <View className="flex-1">
              <Input
                placeholder="Month"
                value={dateOfBirth.month}
                onChangeText={(text) => setDateOfBirth(prev => ({ ...prev, month: text }))}
                inputClassName="text-center"
              />
            </View>
            <View className="flex-1">
              <Input
                placeholder="Day"
                value={dateOfBirth.day}
                onChangeText={(text) => setDateOfBirth(prev => ({ ...prev, day: text }))}
                inputClassName="text-center"
              />
            </View>
            <View className="flex-1">
              <Input
                placeholder="Year"
                value={dateOfBirth.year}
                onChangeText={(text) => setDateOfBirth(prev => ({ ...prev, year: text }))}
                inputClassName="text-center"
              />
            </View>
          </View>
        </View>

        <View className="mt-4">
          <Text className="text-sm text-primary-400 mb-2">Phone number</Text>
          <View className="flex-row gap-2">
            <View className="w-20">
              <Input
                value="NGN"
                editable={false}
                inputClassName="text-center text-gray-500"
              />
            </View>
            <View className="flex-1">
              <Input
                placeholder="+234 (999) 000-0000"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                inputMode="tel"
              />
            </View>
          </View>
        </View>

        <View className="mt-4">
          <Text className="text-sm text-primary-400 mb-2">Gender</Text>
          <View className="flex-row gap-2">
            <Pressable
              onPress={() => setGender('Male')}
              className={`flex-1 py-3 px-4 rounded-xl border ${
                gender === 'Male' ? 'bg-primary border-primary' : 'border-gray-300'
              }`}
            >
              <Text className={`text-center ${gender === 'Male' ? 'text-white' : 'text-gray-700'}`}>
                Male
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setGender('Female')}
              className={`flex-1 py-3 px-4 rounded-xl border ${
                gender === 'Female' ? 'bg-primary border-primary' : 'border-gray-300'
              }`}
            >
              <Text className={`text-center ${gender === 'Female' ? 'text-white' : 'text-gray-700'}`}>
                Female
              </Text>
            </Pressable>
          </View>
        </View>

        <View className="mt-8 mb-6">
          <Pressable
            onPress={handleContinueStep2}
            className="bg-[#2563EB] py-4 rounded-xl"
          >
            <Text className="text-white text-center text-base font-semibold">
              Continue
            </Text>
          </Pressable>
          
          <Text className="text-xs text-gray-500 text-center mt-4 px-4">
            By providing your mobile number, you give us permission to contact you via text.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}