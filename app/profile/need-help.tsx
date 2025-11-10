import { View, Alert } from 'react-native'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import Input from '@/components/form/Input'
import Button from '@/components/ui/Button'
import TextArea from '@/components/form/TextArea'

// Validation schema
const needHelpSchema = z.object({
    firstName: z.string()
        .min(1, 'First name is required')
        .min(2, 'First name must be at least 2 characters')
        .max(50, 'First name must not exceed 50 characters'),
    lastName: z.string()
        .min(1, 'Last name is required')
        .min(2, 'Last name must be at least 2 characters')
        .max(50, 'Last name must not exceed 50 characters'),
    email: z.string()
        .min(1, 'Email is required')
        .email('Please enter a valid email address'),
    message: z.string()
        .min(1, 'Message is required')
        .min(10, 'Message must be at least 10 characters')
        .max(500, 'Message must not exceed 500 characters'),
});

type NeedHelpFormData = z.infer<typeof needHelpSchema>;

const NeedHelp = () => {

    const methods = useForm<NeedHelpFormData>({
        resolver: zodResolver(needHelpSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
            message: '',
        },
        mode: 'onBlur',
    });

    const { handleSubmit, reset } = methods;

    const onSubmit = (data: NeedHelpFormData) => {
        console.log('Help Request Data:', data);
        
        Alert.alert(
            'Success',
            'Your message has been sent successfully. We will get back to you soon!',
            [
                {
                    text: 'OK',
                    onPress: () => {
                        reset();
                    }
                }
            ]
        );
    };

    return(
        <View className='flex-1 bg-white p-5'>

            <View className="mb-5">
                <Input 
                    name="firstName"
                    control={methods.control}
                    label="First Name"
                    placeholder="Enter your first name"
                    autoCapitalize="words"
                />
                <Input 
                    name="lastName"
                    control={methods.control}
                    label="Last Name"
                    placeholder="Enter your last name"
                    autoCapitalize="words"
                    containerClassName="mt-5"
                />
                <Input
                    name="email"
                    control={methods.control}
                    label="Email"
                    placeholder="your.email@example.com"
                    autoCapitalize="none"
                    keyboardType="email-address"
                    containerClassName="mt-5"
                />
                <TextArea 
                    name="message"
                    label="Message"
                    placeholder="Please describe how we can help you..."
                    containerClassName="mt-5"
                    control={methods.control}
                />
            </View>

            <Button onPress={handleSubmit(onSubmit)}>Send Message</Button>
            
        </View>
    )
}

export default NeedHelp