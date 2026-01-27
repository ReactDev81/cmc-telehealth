import { useUpdatePatientProfile } from "@/queries/patient/useUpdatePatientProfile";
import { zodResolver } from "@hookform/resolvers/zod";
import * as ImagePicker from "expo-image-picker";
import { Camera } from "lucide-react-native";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
    ActivityIndicator,
    Alert,
    Image,
    ScrollView,
    TouchableOpacity,
    View,
} from "react-native";
import * as z from "zod";

import DateField from "@/components/form/date";
import { useAuth } from "@/context/UserContext";
import { usePatientProfile } from "@/queries/patient/usePatientProfile";
import Input from "../../../components/form/Input";
import RadioButton from "../../../components/form/radio-button";
import Button from "../../../components/ui/Button";

/* -------------------------------------------------------------------------- */
/*                               ZOD SCHEMA                                   */
/* -------------------------------------------------------------------------- */

const personalInfoSchema = z.object({
    first_name: z
        .string()
        .min(1, "First name is required")
        .min(2, "First name must be at least 2 characters"),

    last_name: z
        .string()
        .min(1, "Last name is required")
        .min(2, "Last name must be at least 2 characters"),

    mobile_no: z
        .string()
        .min(1, "Phone number is required")
        .regex(/^[+]?[\d\s-()]+$/, "Invalid phone number format"),

    date_of_birth: z
        .date({
            required_error: "Date of birth is required",
            invalid_type_error: "Invalid date",
        })
        .refine((date) => {
            const today = new Date();
            let age = today.getFullYear() - date.getFullYear();
            const m = today.getMonth() - date.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < date.getDate())) {
                age--;
            }
            return age >= 13;
        }, "You must be at least 13 years old"),

    gender: z.enum(["male", "female", "other"], {
        required_error: "Please select a gender",
    }),
});

type PersonalInfoFormData = z.infer<typeof personalInfoSchema>;

/* -------------------------------------------------------------------------- */
/*                              COMPONENT                                     */
/* -------------------------------------------------------------------------- */

const EditPersonalInformation = () => {
    const { user, token } = useAuth();
    if (!user) {
        return null;
    }
    const patientId = user.id;

    const { data: profileData, isLoading } = usePatientProfile(patientId, token!);

    useEffect(() => {
        if (!profileData) return;

        setValue("first_name", profileData.first_name);
        setValue("last_name", profileData.last_name);
        setValue("mobile_no", profileData.mobile_no);
        setValue("gender", profileData.gender);

        if (profileData.date_of_birth) {
            setValue("date_of_birth", new Date(profileData.date_of_birth), {
                shouldValidate: true,
            });
        }

        if (profileData.avatar) {
            setProfileImage({ uri: profileData.avatar });
        }
    }, [profileData]);

    const { mutate: updateProfile, isPending } =
        useUpdatePatientProfile(patientId);

    const [profileImage, setProfileImage] = useState<any>(
        require("../../../assets/images/edit-profile.png"),
    );

    const {
        control,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<PersonalInfoFormData>({
        resolver: zodResolver(personalInfoSchema),
        defaultValues: {
            first_name: "",
            last_name: "",
            mobile_no: "",
            gender: "male",
            date_of_birth: undefined as unknown as Date,
        },
    });

    const dateOfBirth = watch("date_of_birth");
    const gender = watch("gender");

    /* -------------------------------------------------------------------------- */
    /*                           IMAGE PICKER LOGIC                               */
    /* -------------------------------------------------------------------------- */

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (status !== "granted") {
            Alert.alert(
                "Permission Denied",
                "Sorry, we need gallery permissions to upload images.",
            );
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled && result.assets?.[0]?.uri) {
            setProfileImage({ uri: result.assets[0].uri });
        }
    };

    const takePhoto = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();

        if (status !== "granted") {
            Alert.alert(
                "Permission Denied",
                "Sorry, we need camera permissions to take photos.",
            );
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled && result.assets?.[0]?.uri) {
            setProfileImage({ uri: result.assets[0].uri });
        }
    };

    const handleImageUpload = () => {
        Alert.alert("Upload Photo", "Choose an option", [
            { text: "Take Photo", onPress: takePhoto },
            { text: "Choose from Gallery", onPress: pickImage },
            { text: "Cancel", style: "cancel" },
        ]);
    };

    /* -------------------------------------------------------------------------- */
    /*                               SUBMIT                                       */
    /* -------------------------------------------------------------------------- */

    const onSubmit = (formData: PersonalInfoFormData) => {
        const payload = {
            first_name: formData.first_name,
            last_name: formData.last_name,
            mobile_no: formData.mobile_no,
            date_of_birth: formData.date_of_birth.toISOString().split("T")[0],
            gender: formData.gender,
            group: "personal_information" as const,
        };

        console.log("payload :", payload);
        updateProfile(payload, {
            onSuccess: (response: any) => {
                Alert.alert("Success", response?.message || "Profile updated");
                console.log("response :", response);
            },
            onError: (error: any) => {
                Alert.alert(
                    "Error",
                    error?.response?.data?.message || "Something went wrong",
                );
                console.log("error:", error?.response?.data?.message);
            },
        });
    };

    /* -------------------------------------------------------------------------- */
    /*                                 UI                                         */
    /* -------------------------------------------------------------------------- */

    if (isLoading) {
        return (
            <View className="flex-1 items-center justify-center">
                <ActivityIndicator size="large" color="#013220" />
            </View>
        );
    }

    return (
        <ScrollView className="flex-1 bg-white p-5">
            {/* Profile Image */}
            <View className="w-32 h-32 mx-auto relative">
                <Image
                    source={profileImage}
                    className="w-32 h-32 rounded-full"
                    resizeMode="cover"
                />

                <TouchableOpacity
                    className="w-8 h-8 rounded-full bg-primary-100 absolute bottom-0 right-0 items-center justify-center"
                    onPress={handleImageUpload}
                    activeOpacity={0.7}
                >
                    <Camera size={16} color="#013220" />
                </TouchableOpacity>
            </View>

            {/* Form */}
            <View className="max-w-[350px] w-full mx-auto bg-white p-5 rounded-xl shadow-custom mt-10">
                <Input
                    name="first_name"
                    control={control}
                    label="First Name"
                    placeholder="Enter First Name"
                />

                <Input
                    name="last_name"
                    control={control}
                    label="Last Name"
                    placeholder="Enter Last Name"
                    containerClassName="mt-5"
                />

                <Input
                    name="mobile_no"
                    control={control}
                    label="Phone"
                    keyboardType="phone-pad"
                    placeholder="+123-456-789"
                    containerClassName="mt-5"
                />

                <DateField
                    label="Date of Birth"
                    value={dateOfBirth}
                    onChange={(date) =>
                        setValue("date_of_birth", date as Date, {
                            shouldValidate: true,
                        })
                    }
                    maximumDate={new Date()}
                    placeholder="DD/MM/YYYY"
                    error={errors.date_of_birth?.message}
                    className="mt-5"
                />

                <RadioButton
                    name="gender"
                    label="Gender"
                    value={gender}
                    options={[
                        { value: "male", label: "Male" },
                        { value: "female", label: "Female" },
                        { value: "other", label: "Other" },
                    ]}
                    onChange={(value) =>
                        setValue("gender", value as "male" | "female" | "other", {
                            shouldValidate: true,
                        })
                    }
                    direction="horizontal"
                    className="mt-5"
                />

                <Button
                    onPress={handleSubmit(onSubmit)}
                    disabled={isPending}
                    className="mt-6"
                >
                    {isPending ? "Saving..." : "Save"}
                </Button>
            </View>
        </ScrollView>
    );
};

export default EditPersonalInformation;
