import { View, Image, TouchableOpacity, Alert } from "react-native"
import { Camera } from 'lucide-react-native';
import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import Input from "../../components/form/Input";
import Button from "../../components/ui/Button";
import RadioButton from "../../components/form/radio-button";
import DateField from "../../components/form/date";

const EditPersonalInformation = () => {

    const [profileImage, setProfileImage] = useState(require('../../assets/images/edit-profile.png'));
    const [isImageUri, setIsImageUri] = useState(false);

    const pickImage = async () => {

        // Request permission
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        
        if (status !== 'granted') {
            Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to upload images.');
            return;
        }

        // Launch image picker
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

        // Request permission
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        
        if (status !== 'granted') {
            Alert.alert('Permission Denied', 'Sorry, we need camera permissions to take photos.');
            return;
        }

        // Launch camera
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

    const [gender, setGender] = useState('male');

    const genderOptions = [
        { value: 'male', label: 'Male' },
        { value: 'female', label: 'Female' },
        { value: 'other', label: 'Other' }
    ];

    const [dateOfBirth, setDateOfBirth] = useState<Date | undefined>(undefined);

    return(
        <View className="flex-1 bg-white p-5">

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
                    <Camera size={16} color="#2D4095" />
                </TouchableOpacity>
            </View>

            {/* form fields */}
            <View className="max-w-[350px] w-full mx-auto bg-white p-5 rounded-xl shadow-custom mt-10">

                <View className="mb-5">
                    <Input 
                        label="First Name"
                        placeholder="Enter First Name"
                    />
                    <Input 
                        label="Last Name"
                        placeholder="Enter Last Name"
                        containerClassName="mt-5"
                    />
                    <Input
                        label="Phone"
                        autoCapitalize="none"
                        placeholder="+123-456-789"
                        containerClassName="mt-5"
                    />
                    <DateField
                        label="Date of Birth"
                        value={dateOfBirth}
                        onChange={setDateOfBirth}
                        placeholder="DD/MM/YYYY"
                        maximumDate={new Date()}
                        className="mt-5"
                    />
                    <RadioButton
                        name="gender"
                        label="Gender"
                        options={genderOptions}
                        value={gender}
                        onChange={setGender}
                        direction="horizontal"
                        className="mt-5"
                    />
                </View>

                <Button>Save</Button>

            </View>
        </View>
    )
}

export default EditPersonalInformation