import DateField from "@/components/form/date";
import Input from "@/components/form/Input";
import PasswordInput from "@/components/form/password";
import SelectField from "@/components/form/selectField";
import ApiError from "@/components/ui/ApiError";
import Button from "@/components/ui/Button";
import { useNotification } from "@/context/NotificationContext";
import { useAuth } from "@/context/UserContext";
import { useCompleteProfile } from "@/mutations/useCompleteProfile";
import { User } from "@/types/common/user-context";
import { zodResolver } from "@hookform/resolvers/zod";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { Pressable, Text, View } from "react-native";
import { z } from "zod";
import FormLayout from "../formLayout";

const bloodGroupOptions = [
    { label: "A+", value: "A+" },
    { label: "A-", value: "A-" },
    { label: "B+", value: "B+" },
    { label: "B-", value: "B-" },
    { label: "AB+", value: "AB+" },
    { label: "AB-", value: "AB-" },
    { label: "O+", value: "O+" },
    { label: "O-", value: "O-" },
];

const schema = z.object({
    first_name: z.string().min(1, "First name is required"),
    last_name: z.string().min(1, "Last name is required"),
    date_of_birth: z
        .date({ required_error: "Date of birth is required" })
        .refine((date) => {
            const today = new Date();
            const age = today.getFullYear() - date.getFullYear();
            return age <= 100;
        }, {
            message: "Age cannot be more than 100 years",
        }),
    mobile_no: z
        .string()
        .regex(/^\d{10}$/, "Phone number must contain exactly 10 digits"),
    gender: z.string().min(1, "Gender is required"),
    blood_group: z.string().min(1, "Blood group is required"),
    email: z.string().email("Enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    is_existing_patient: z.boolean({ required_error: "Please select an option" }),
    existing_patient_id: z.string().optional(),
}).refine((data) => {
    if (data.is_existing_patient && (!data.existing_patient_id || data.existing_patient_id.trim() === "")) {
        return false;
    }
    return true;
}, {
    message: "Existing Patient ID is required",
    path: ["existing_patient_id"],
});

type FormValues = z.infer<typeof schema>;

export default function RegisterCompleteProfile() {

    const { login: paramLogin, mobile_no, country_code = "+91", email } = useLocalSearchParams<{
        login?: string;
        mobile_no?: string;
        country_code?: string;
        email?: string;
    }>();

    const { login: setAuthUser, user } = useAuth();
    const { mutate: completeProfile, isPending, isError, error } = useCompleteProfile();
    const { deviceInfo } = useNotification();

    const finalLogin = typeof paramLogin === "string" && paramLogin
        ? paramLogin
        : (typeof mobile_no === "string" && mobile_no ? mobile_no : user?.phone ?? "");
    const finalCountryCode = typeof country_code === "string" && country_code ? country_code : "+91";

    const { control, handleSubmit, reset, watch, setValue } = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            first_name: "",
            last_name: "",
            date_of_birth: undefined,
            mobile_no: finalLogin,
            gender: "",
            blood_group: "",
            email: "",
            password: "",
            is_existing_patient: false,
            existing_patient_id: "",
        }
    });

    const isExistingPatient = watch("is_existing_patient");

    // Prefill mobile number and clean initial email once available
    useEffect(() => {
        const initialEmail = typeof email === "string" && email.includes("@")
            ? email
            : (user?.email && user.email.includes("@") ? user.email : "");

        reset({
            first_name: "",
            last_name: "",
            date_of_birth: undefined,
            mobile_no: finalLogin,
            gender: "",
            blood_group: "",
            email: initialEmail,
            password: "",
            is_existing_patient: false,
            existing_patient_id: "",
        });
    }, [finalLogin, email, user?.email]);

    const onSubmit = (formData: FormValues) => {
        const payload: any = {
            first_name: formData.first_name,
            last_name: formData.last_name,
            date_of_birth: formData.date_of_birth instanceof Date
                ? formData.date_of_birth.toISOString().split("T")[0]
                : String(formData.date_of_birth),
            gender: formData.gender.toLowerCase(),
            blood_group: formData.blood_group,
            mobile_no: formData.mobile_no,
            login: finalLogin || formData.mobile_no,
            country_code: finalCountryCode,
            email: formData.email,
            password: formData.password,
            is_existing_patient: formData.is_existing_patient,
            treatment_consent_accepted: true,
            book_appointment: false,
            expo_push_token: deviceInfo?.expo_push_token ?? "",
            device_type: deviceInfo?.device_type ?? "",
            device_name: deviceInfo?.device_name ?? "",
            app_version: deviceInfo?.app_version ?? "",
        };

        if (formData.is_existing_patient) {
            payload.existing_patient_id = formData.existing_patient_id;
        }

        completeProfile(
            {
                payload,
            },
            {
                onSuccess: async (data) => {
                    const profileData = data.data;

                    const userData: User = {
                        id: profileData.id,
                        first_name: profileData.first_name,
                        last_name: profileData.last_name,
                        avatar: profileData.avatar,
                        email: profileData.email,
                        gender: profileData.gender,
                        date_of_birth: profileData.date_of_birth,
                        role: "patient",
                        phone: profileData.phone,
                        patient_id: profileData.patient_id ?? undefined,
                        doctor_id: undefined,
                        status: profileData.status,
                        address: {
                            address: profileData.address?.address ?? null,
                            area: profileData.address?.area ?? null,
                            city: profileData.address?.city ?? null,
                            landmark: profileData.address?.landmark ?? null,
                            pincode: profileData.address?.pincode ?? null,
                            state: profileData.address?.state ?? null,
                        },
                        existing_patient_id: profileData.existing_patient_id ?? undefined,
                        is_existing_patient: profileData.is_existing_patient ?? undefined,
                    };

                    await setAuthUser(userData, data.token);

                    if (typeof router.canDismiss === "function" && router.canDismiss()) {
                        router.dismissAll();
                    }
                    router.replace("/(patient)");
                },
                onError: (err) => {
                    console.log("complete profile error:", err?.response?.data || err);
                },
            },
        );
    };

    return (
        <FormLayout>

            <View className="py-10">

                <View className="mb-4">
                    <Text className="text-black text-2xl font-semibold text-center">
                        Basic Information
                    </Text>
                    <Text className="text-black-400 text-base mt-2 text-center max-w-80 mx-auto">
                        Please tell us some basic information to complete your profile:
                    </Text>
                </View>

                {/* First Name */}
                <Input
                    name="first_name"
                    control={control}
                    label="First Name"
                    placeholder="First Name"
                    containerClassName="mt-5"
                />

                {/* Last Name */}
                <Input
                    name="last_name"
                    control={control}
                    label="Last Name"
                    placeholder="Last Name"
                    containerClassName="mt-5"
                />

                {/* DOB */}
                <Controller
                    control={control}
                    name="date_of_birth"
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                        <DateField
                            label="Date of Birth"
                            value={value}
                            onChange={onChange}
                            error={error?.message}
                            className="mt-5"
                            minimumDate={new Date(1900, 0, 1)}
                            maximumDate={new Date()}
                        />
                    )}
                />

                {/* Phone / WhatsApp Number */}
                <Input
                    name="mobile_no"
                    label="WhatsApp / Phone Number"
                    containerClassName="mt-5"
                    control={control}
                    placeholder="10-digit mobile number"
                    keyboardType="number-pad"
                    numericOnly={true}
                />

                {/* Gender */}
                <View>
                    <Text className="text-sm text-black mb-2 mt-5">Gender</Text>
                    <Controller
                        control={control}
                        name="gender"
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                            <View>
                                <View className="flex-row gap-2">
                                    {["Male", "Female"].map((g) => (
                                        <Pressable
                                            key={g}
                                            onPress={() => onChange(g)}
                                            className={`flex-1 py-4 px-4 rounded-xl border ${
                                                value === g
                                                    ? "bg-primary border-primary"
                                                    : "border-primary"
                                            }`}
                                        >
                                            <Text
                                                className={`text-center ${
                                                    value === g ? "text-white" : "text-primary"
                                                }`}
                                            >
                                                {g}
                                            </Text>
                                        </Pressable>
                                    ))}
                                </View>
                                {error && (
                                    <Text className="text-xs text-red-600 mt-1">{error.message}</Text>
                                )}
                            </View>
                        )}
                    />
                </View>

                {/* Blood Group */}
                <SelectField
                    name="blood_group"
                    label="Blood Group"
                    control={control}
                    options={bloodGroupOptions}
                    placeholder="Select Blood Group"
                    className="mt-5"
                />

                {/* Email Address */}
                <Input
                    name="email"
                    control={control}
                    label="Email Address"
                    placeholder="example@email.com"
                    containerClassName="mt-5"
                    editable={true}
                    keyboardType="email-address"
                />

                {/* Password */}
                <PasswordInput
                    name="password"
                    control={control}
                    label="Password"
                    placeholder="Password"
                    containerClassName="mt-5"
                />

                {/* Are you an existing patient? */}
                <View>
                    <Text className="text-sm text-black mb-2 mt-5">Are you an existing patient?</Text>
                    <Controller
                        control={control}
                        name="is_existing_patient"
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                            <View>
                                <View className="flex-row gap-2">
                                    {[
                                        { label: "Yes", val: true },
                                        { label: "No", val: false },
                                    ].map((option) => (
                                        <Pressable
                                            key={option.label}
                                            onPress={() => {
                                                onChange(option.val);
                                                if (!option.val) {
                                                    setValue("existing_patient_id", "");
                                                }
                                            }}
                                            className={`flex-1 py-4 px-4 rounded-xl border ${
                                                value === option.val
                                                    ? "bg-primary border-primary"
                                                    : "border-primary"
                                            }`}
                                        >
                                            <Text
                                                className={`text-center ${
                                                    value === option.val ? "text-white" : "text-primary"
                                                }`}
                                            >
                                                {option.label}
                                            </Text>
                                        </Pressable>
                                    ))}
                                </View>
                                {error && (
                                    <Text className="text-xs text-red-600 mt-1">{error.message}</Text>
                                )}
                            </View>
                        )}
                    />
                </View>

                {/* Existing Patient ID */}
                {isExistingPatient && (
                    <Input
                        name="existing_patient_id"
                        control={control}
                        label="Existing Patient ID"
                        placeholder="PAT-001"
                        containerClassName="mt-5"
                    />
                )}

                {/* api error message */}
                <ApiError
                    message={
                        isError
                            ? ((error as any)?.response?.data?.errors?.message ??
                                (error as any)?.response?.data?.message ??
                                (error as any)?.message ??
                                "Something went wrong. Please try again.")
                            : null
                    }
                />

                <Button
                    onPress={handleSubmit(onSubmit)}
                    disabled={isPending}
                    className="mt-6"
                >
                    {isPending ? "loading..." : "Continue"}
                </Button>

                <Text className="text-base text-black-400 text-center mt-5 px-4">
                    By providing your mobile number, you give us permission to contact you
                    via text.
                </Text>

            </View>

        </FormLayout>
    );
}
