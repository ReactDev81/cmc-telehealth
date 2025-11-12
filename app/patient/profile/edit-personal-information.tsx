import { View, Image, TouchableOpacity, Alert, ScrollView } from "react-native"
import { Camera } from 'lucide-react-native';
import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Input from "../../../components/form/Input";
import Button from "../../../components/ui/Button";
import RadioButton from "../../../components/form/radio-button";
import DateField from "../../../components/form/date";

// Validation schema
const personalInfoSchema = z.object({
    firstName: z.string().min(1, 'First name is required').min(2, 'First name must be at least 2 characters'),
    lastName: z.string().min(1, 'Last name is required').min(2, 'Last name must be at least 2 characters'),
    phone: z.string().min(1, 'Phone number is required').regex(/^[+]?[\d\s-()]+$/, 'Invalid phone number format'),
    dateOfBirth: z.date({ required_error: 'Date of birth is required' }).refine(
        (date) => {
            const age = new Date().getFullYear() - date.getFullYear();
            return age >= 13;
        },
        { message: 'You must be at least 13 years old' }
    ),
    gender: z.enum(['male', 'female', 'other'], {
        required_error: 'Please select a gender',
    }),
});

type PersonalInfoFormData = z.infer<typeof personalInfoSchema>;

const EditPersonalInformation = () => {

    const [profileImage, setProfileImage] = useState(require('../../../assets/images/edit-profile.png'));
    const [isImageUri, setIsImageUri] = useState(false);

    const { control, handleSubmit, setValue, watch, formState: { errors } } = useForm<PersonalInfoFormData>({
        resolver: zodResolver(personalInfoSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            phone: '',
            gender: 'male',
        }
    });

    const dateOfBirth = watch('dateOfBirth');
    const gender = watch('gender');

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        
        if (status !== 'granted') {
            Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to upload images.');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled && result.assets[0]) {
            setProfileImage({ uri: result.assets[0].uri });
            setIsImageUri(true);
        }
    };

    const takePhoto = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        
        if (status !== 'granted') {
            Alert.alert('Permission Denied', 'Sorry, we need camera permissions to take photos.');
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled && result.assets[0]) {
            setProfileImage({ uri: result.assets[0].uri });
            setIsImageUri(true);
        }
    };

    const handleImageUpload = () => {
        Alert.alert(
            'Upload Photo',
            'Choose an option',
            [
                { text: 'Take Photo', onPress: takePhoto },
                { text: 'Choose from Gallery', onPress: pickImage },
                { text: 'Cancel', style: 'cancel' }
            ]
        );
    };

    const genderOptions = [
        { value: 'male', label: 'Male' },
        { value: 'female', label: 'Female' },
        { value: 'other', label: 'Other' }
    ];

    const onSubmit = (data: PersonalInfoFormData) => {
        console.log('Form Data:', data);
        Alert.alert('Success', 'Personal information saved successfully!');
    };

    return(
        <ScrollView className="flex-1 bg-white p-5">

            {/* upload image */}
            <View className="max-w-32 w-full mx-auto items-center justify-center relative">
                <Image 
                    source={isImageUri ? profileImage : profileImage} 
                    className="w-32 h-32 rounded-full"
                    resizeMode="cover"
                />
                <TouchableOpacity
                    className="w-8 h-8 rounded-full bg-primary-100 absolute bottom-0 right-0 items-center justify-center"
                    activeOpacity={0.7}
                    onPress={handleImageUpload}
                >
                    <Camera size={16} color="#013220" />
                </TouchableOpacity>
            </View>

            {/* form fields */}
            <View className="max-w-[350px] w-full mx-auto bg-white p-5 rounded-xl shadow-custom mt-10">

                <View className="mb-5">
                    <Input 
                        name="firstName"
                        control={control}
                        label="First Name"
                        placeholder="Enter First Name"
                    />
                    <Input 
                        name="lastName"
                        control={control}
                        label="Last Name"
                        placeholder="Enter Last Name"
                        containerClassName="mt-5"
                    />
                    <Input
                        name="phone"
                        control={control}
                        label="Phone"
                        autoCapitalize="none"
                        placeholder="+123-456-789"
                        keyboardType="phone-pad"
                        containerClassName="mt-5"
                    />
                    <DateField
                        label="Date of Birth"
                        value={dateOfBirth}
                        onChange={(date) => setValue('dateOfBirth', date as Date, { shouldValidate: true })}
                        placeholder="DD/MM/YYYY"
                        maximumDate={new Date()}
                        error={errors.dateOfBirth?.message}
                        className="mt-5"
                    />
                    <RadioButton
                        name="gender"
                        label="Gender"
                        options={genderOptions}
                        value={gender}
                        onChange={(value) => setValue('gender', value as 'male' | 'female' | 'other', { shouldValidate: true })}
                        direction="horizontal"
                        className="mt-5"
                    />
                </View>

                <Button onPress={handleSubmit(onSubmit)}>Save</Button>

            </View>
        </ScrollView>
    )
}

export default EditPersonalInformation