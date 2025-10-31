import { Link, router } from 'expo-router';
import { View, Text, Pressable, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Input from '@/components/form/Input';
import Button from '@/components/ui/Button';

const resetPasswordSchema = z.object({
    email: z.string().min(1, 'Email is required').email('Enter a valid email address'),
});

type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordScreen() {

    const { control, handleSubmit, formState: { errors } } = useForm<ResetPasswordForm>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: { email: '' },
    });

    const onSubmit = (data: ResetPasswordForm) => {
        console.log('Reset password for:', data.email);
        router.push('/auth/verify-otp');
    };

    return (
        <SafeAreaView className="flex-1 justify-center bg-white px-6">

            {/* Logo and App Name */}
            <View className="mb-6">
                <Image
                    source={require('../../assets/images/cmc-telehealth-logo.png')}
                    className="w-24 h-24 mx-auto object-contain"
                />
                <Text className="text-base text-black text-center font-bold mt-1">
                    CMC Telehealth
                </Text>
            </View>

            {/* Title */}
            <View className="mt-4">
                <Text className="text-black text-2xl font-bold text-center">
                    Reset Password
                </Text>
                <Text className="text-gray-500 mt-2 text-center px-4">
                    Enter your email to receive reset instructions
                </Text>
            </View>

            {/* Email Field */}
            <View className="mt-8">
                <Input
                    name="email"
                    label="Email"
                    control={control}
                    placeholder="example@email.com"
                    autoCapitalize="none"
                    keyboardType="email-address"
                />
            </View>

            {/* Submit Button */}
            <View className="mt-5">
                <Button onPress={handleSubmit(onSubmit)}>
                    <Text className="text-white text-center text-base font-semibold">
                        Continue
                    </Text>
                </Button>
            </View>

            {/* Back to Login */}
            <View className="mt-5">
                <Link href="/auth/login" asChild>
                    <Pressable>
                        <Text className="text-primary text-base text-center">
                            Back to login
                        </Text>
                    </Pressable>
                </Link>
            </View>

        </SafeAreaView>
    );
}