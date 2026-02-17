import DateField from "@/components/form/date";
import { useAuth } from "@/context/UserContext";
import { useUpdatePatientProfile } from "@/queries/patient/useUpdatePatientProfile";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import * as ImagePicker from "expo-image-picker";
import { Camera } from "lucide-react-native";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Alert, Image, ScrollView, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as z from "zod";
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

    email: z.string().optional(),

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
    const { user, token, updateUser } = useAuth();
    if (!user) {
        return null;
    }
    const patientId = user.id;

    // const { data: profileData, isLoading, refetch } = usePatientProfile(patientId, token!);
    const qc = useQueryClient();
    const insets = useSafeAreaInsets();

    useEffect(() => {
        if (!user) return;

        setValue("first_name", user.first_name);
        setValue("last_name", user.last_name);
        setValue("mobile_no", user.phone);
        const genderValue =
            user.gender === "male" || user.gender === "female" || user.gender === "other"
                ? user.gender
                : "other";
        setValue("gender", genderValue);
        setValue("email", user.email);

        if (user.date_of_birth) {
            setValue("date_of_birth", new Date(user.date_of_birth), {
                shouldValidate: true,
            });
        }

        if (user.avatar) {
            setProfileImage({ uri: user.avatar });
        }
    }, []);

    // Sync profile image when user context updates
    useEffect(() => {
        if (user.avatar) {
            setProfileImage({ uri: user.avatar });
        }
    }, [user.avatar]);

    const { mutate: updateProfile, isPending } = useUpdatePatientProfile(patientId);

    const [profileImage, setProfileImage] = useState<any>(
        user.avatar
            ? { uri: user.avatar }
            : require("../../../assets/images/user.png")
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
            first_name: user.first_name,
            last_name: user.last_name,
            mobile_no: user.phone,
            email: user.email,
            gender:
                user.gender === "male" || user.gender === "female" || user.gender === "other"
                    ? user.gender
                    : "other",
            date_of_birth: user.date_of_birth ? new Date(user.date_of_birth) : (undefined as unknown as Date),
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
        const common = {
            first_name: formData.first_name,
            last_name: formData.last_name,
            mobile_no: formData.mobile_no,
            date_of_birth: formData.date_of_birth.toISOString().split("T")[0],
            gender: formData.gender,
            group: "personal_information" as const,
        };

        // Check if image was selected (has uri that's different from default)
        const isNewImage = profileImage && typeof profileImage === "object" && profileImage.uri && !profileImage.uri.includes("edit-profile.png");

        if (isNewImage) {
            // Send FormData with avatar image
            const uri: string = profileImage.uri;
            const fileName = uri.split("/").pop() || "avatar.jpg";
            const match = /\.([0-9a-z]+)(?:\?|$)/i.exec(fileName);
            const fileType = match ? `image/${match[1]}` : "image/jpeg";

            const form = new FormData();
            form.append("first_name", common.first_name);
            form.append("last_name", common.last_name);
            form.append("mobile_no", common.mobile_no);
            form.append("date_of_birth", common.date_of_birth);
            form.append("gender", common.gender);
            form.append("group", common.group);
            // @ts-ignore - React Native FormData file object
            form.append("avatar", { uri, name: fileName, type: fileType });

            // console.log("sending FormData with avatar", { uri, fileName, fileType });

            updateProfile(form as any, {
                onSuccess: async (response: any) => {
                    // Backend now returns updated data in response.data
                    const updatedData = response?.data;
                    // console.log("response data :", updatedData);

                    // Update UserContext with name and avatar from response
                    updateUser({
                        first_name: updatedData?.first_name,
                        last_name: updatedData?.last_name,
                        avatar: updatedData?.avatar,
                        phone: updatedData?.mobile_no,
                        date_of_birth: updatedData?.date_of_birth,
                        gender: updatedData?.gender,
                    });

                    // Update form with response data
                    if (updatedData?.avatar) {
                        setProfileImage({ uri: updatedData.avatar });
                    }

                    // Invalidate cache for consistency
                    try {
                        await qc.invalidateQueries({ queryKey: ["patient-profile", patientId, "personal_information"] });
                    } catch (e) { }

                    Alert.alert("Success", response?.message || "Profile updated");
                },
                onError: (error: any) => {
                    Alert.alert(
                        "Error",
                        error?.response?.data?.message || error?.message || "Something went wrong",
                    );
                    // console.log("error:", error?.response?.data?.message || error?.message);
                },
            });
            return;
        }

        // Send regular JSON payload (no image)
        const payload = { ...common };
        console.log("payload :", payload);
        // console.log("payload :", payload);

        updateProfile(payload, {
            onSuccess: async (response: any) => {
                // Backend now returns updated data in response.data
                const updatedData = response?.data;
                // console.log("response data :", updatedData);

                // Update UserContext with name (avatar may not change)
                updateUser({
                    name: `${updatedData?.first_name} ${updatedData?.last_name}`,
                    ...(updatedData?.avatar && { avatar: updatedData.avatar }),
                });

                // Invalidate cache for consistency
                try {
                    await qc.invalidateQueries({ queryKey: ["patient-profile", patientId, "personal_information"] });
                } catch (e) { }

                Alert.alert("Success", response?.message || "Profile updated");
            },
            onError: (error: any) => {
                Alert.alert(
                    "Error",
                    error?.response?.data?.message || error?.message || "Something went wrong",
                );
                // console.log("error:", error?.response?.data?.message || error?.message);
            },
        });
    };

    /* -------------------------------------------------------------------------- */
    /*                                 UI                                         */
    /* -------------------------------------------------------------------------- */

    return (
        <ScrollView
            className="flex-1 bg-white p-5"
            contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}
        >
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
        </ScrollView>
    );
};

export default EditPersonalInformation;
