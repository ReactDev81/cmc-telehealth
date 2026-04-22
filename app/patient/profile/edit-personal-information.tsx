import FormLayout from "@/app/formLayout";
import DateField from "@/components/form/date";
import Input from "@/components/form/Input";
import RadioButton from "@/components/form/radio-button";
import Button from "@/components/ui/Button";
import { useAuth } from "@/context/UserContext";
import { useUpdatePatientProfile } from "@/queries/patient/useUpdatePatientProfile";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import * as ImagePicker from "expo-image-picker";
import { Camera } from "lucide-react-native";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Alert, Image, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as z from "zod";

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
    email: z.string().optional(),
    date_of_birth: z
        .date({
            required_error: "Date of birth is required",
            invalid_type_error: "Invalid date",
        })
        .refine((date) => {
            const today = new Date();
            let age = today.getFullYear() - date.getFullYear();
            const monthDiff = today.getMonth() - date.getMonth();

            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < date.getDate())) {
                age--;
            }

            return age >= 13;
        }, "You must be at least 13 years old"),
    gender: z.enum(["male", "female", "other"], {
        required_error: "Please select a gender",
    }),
});

type PersonalInfoFormData = z.infer<typeof personalInfoSchema>;

const DEFAULT_AVATAR = require("../../../assets/images/user.png");

const isLocalImageUri = (uri?: string) => {
    if (!uri) {
        return false;
    }

    return (
        uri.startsWith("file://") ||
        uri.startsWith("content://") ||
        uri.startsWith("asset-library://") ||
        uri.startsWith("ph://")
    );
};

const getGenderValue = (gender?: string) => {
    if (gender === "male" || gender === "female" || gender === "other") {
        return gender;
    }

    return "other";
};

const EditPersonalInformation = () => {
    const { user, updateUser } = useAuth();
    const qc = useQueryClient();
    const insets = useSafeAreaInsets();
    const patientId = user?.id ?? "";

    const [profileImage, setProfileImage] = useState<any>(
        user?.avatar ? { uri: user.avatar } : DEFAULT_AVATAR
    );

    const { mutate: updateProfile, isPending } = useUpdatePatientProfile(patientId);

    const {
        control,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors },
    } = useForm<PersonalInfoFormData>({
        resolver: zodResolver(personalInfoSchema),
        defaultValues: {
            first_name: user?.first_name ?? "",
            last_name: user?.last_name ?? "",
            mobile_no: user?.phone ?? "",
            email: user?.email ?? "",
            gender: getGenderValue(user?.gender),
            date_of_birth: user?.date_of_birth ? new Date(user.date_of_birth) : undefined,
        },
    });

    useEffect(() => {
        if (!user) {
            reset({
                first_name: "",
                last_name: "",
                mobile_no: "",
                email: "",
                gender: "other",
                date_of_birth: undefined,
            });
            setProfileImage(DEFAULT_AVATAR);
            return;
        }

        reset({
            first_name: user.first_name,
            last_name: user.last_name,
            mobile_no: user.phone,
            email: user.email,
            gender: getGenderValue(user.gender),
            date_of_birth: user.date_of_birth ? new Date(user.date_of_birth) : undefined,
        });
        setProfileImage(user.avatar ? { uri: user.avatar } : DEFAULT_AVATAR);
    }, [reset, user]);

    const dateOfBirth = watch("date_of_birth");
    const gender = watch("gender");

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (status !== "granted") {
            Alert.alert(
                "Permission Denied",
                "Sorry, we need gallery permissions to upload images."
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
                "Sorry, we need camera permissions to take photos."
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

    const handleSuccess = async (response: any) => {
        const updatedData = response?.data;

        await updateUser({
            first_name: updatedData?.first_name ?? user?.first_name ?? "",
            last_name: updatedData?.last_name ?? user?.last_name ?? "",
            avatar: updatedData?.avatar ?? user?.avatar,
            phone: updatedData?.mobile_no ?? user?.phone ?? "",
            date_of_birth: updatedData?.date_of_birth ?? user?.date_of_birth ?? "",
            gender: updatedData?.gender ?? user?.gender ?? "other",
        });

        if (updatedData?.avatar) {
            setProfileImage({ uri: updatedData.avatar });
        }

        try {
            await qc.invalidateQueries({
                queryKey: ["patient-profile", patientId, "personal_information"],
            });
        } catch {}

        Alert.alert("Success", response?.message || "Profile updated");
    };

    const onSubmit = (formData: PersonalInfoFormData) => {
        if (!user) {
            return;
        }

        const common = {
            first_name: formData.first_name,
            last_name: formData.last_name,
            mobile_no: formData.mobile_no,
            date_of_birth: formData.date_of_birth.toISOString().split("T")[0],
            gender: formData.gender,
            group: "personal_information" as const,
        };

        const avatarUri =
            profileImage && typeof profileImage === "object" ? profileImage.uri : undefined;
        const isNewImage = isLocalImageUri(avatarUri);

        if (isNewImage && avatarUri) {
            const fileName = avatarUri.split("/").pop() || "avatar.jpg";
            const match = /\.([0-9a-z]+)(?:\?|$)/i.exec(fileName);
            const fileType = match ? `image/${match[1]}` : "image/jpeg";

            const form = new FormData();
            form.append("first_name", common.first_name);
            form.append("last_name", common.last_name);
            form.append("mobile_no", common.mobile_no);
            form.append("date_of_birth", common.date_of_birth);
            form.append("gender", common.gender);
            form.append("group", common.group);
            // @ts-ignore React Native FormData file object
            form.append("avatar", { uri: avatarUri, name: fileName, type: fileType });

            updateProfile(form as any, {
                onSuccess: handleSuccess,
                onError: (error: any) => {
                    Alert.alert(
                        "Error",
                        error?.response?.data?.errors?.message ||
                            error?.message ||
                            "Something went wrong"
                    );
                },
            });
            return;
        }

        updateProfile(common, {
            onSuccess: handleSuccess,
            onError: (error: any) => {
                Alert.alert(
                    "Error",
                    error?.response?.data?.errors?.message ||
                        error?.message ||
                        "Something went wrong"
                );
            },
        });
    };

    if (!user) {
        return null;
    }

    return (
        <FormLayout contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}>
            <View className="relative mx-auto h-32 w-32">
                <Image
                    source={profileImage}
                    className="h-32 w-32 rounded-full"
                    resizeMode="cover"
                />

                <TouchableOpacity
                    className="absolute bottom-0 right-0 h-8 w-8 items-center justify-center rounded-full bg-primary-100"
                    onPress={handleImageUpload}
                    activeOpacity={0.7}
                >
                    <Camera size={16} color="#013220" />
                </TouchableOpacity>
            </View>

            <View className="mx-auto mt-10 w-full max-w-[350px] rounded-xl bg-white p-5">
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

                <View pointerEvents="none">
                    <Input
                        name="email"
                        control={control}
                        label="Email"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        containerClassName="mt-5 opacity-40"
                    />
                </View>

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
        </FormLayout>
    );
};

export default EditPersonalInformation;
