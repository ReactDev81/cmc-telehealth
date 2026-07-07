import FormLayout from "@/app/formLayout";
import Input from "@/components/form/Input";
import TextArea from "@/components/form/TextArea";
import Button from "@/components/ui/Button";
import { useAuth } from "@/context/UserContext";
import { useDoctorProfile } from "@/queries/doctor/useDoctorProfile";
import { useUpdateDoctorProfile } from "@/queries/doctor/useUpdateDoctorProfile";
import { PersonalInformation } from "@/types/live/doctor/profile";
import { zodResolver } from "@hookform/resolvers/zod";
import * as ImagePicker from "expo-image-picker";
import { Camera } from "lucide-react-native";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Alert, Image, TouchableOpacity, View } from "react-native";
import { z } from "zod";

const personalInfoSchema = z.object({
  first_name: z
    .string()
    .min(2, "First name must be at least 2 characters long"),
  last_name: z.string().optional(),
  email: z.string().email("Please enter a valid email"),
  specialty: z.string().optional(),
  bio: z.string().optional(),
});

type PersonalInfoFormData = z.infer<typeof personalInfoSchema>;

const EditPersonalInformation = () => {
  const { user, token, updateUser } = useAuth();
  const doctorID = user?.id || "";

  const { data: doctorProfile } = useDoctorProfile<PersonalInformation>(
    doctorID,
    "personal_information",
  );

  // console.log('doctorProfile', doctorProfile);

  const { control, handleSubmit, reset } = useForm<PersonalInfoFormData>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      specialty: "",
      bio: "",
    },
  });

  // 1. Initial prefill from useAuth (instant)
  useEffect(() => {
    if (user) {
      const initialValues = {
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        email: user.email || "",
        // specialty: (user as any).department_id || "",
        specialty:
          (user as any).doctor_departments
            ?.map((item: any) => item.department_name)
            .join(", ") || "",
        bio: (user as any).bio || "",
      };
      // console.log("Initial prefill from Auth:", initialValues);
      reset(initialValues);
      if (user.avatar) {
        setImage(user.avatar);
      }
    }
  }, [user, reset]);

  // 2. Sync with useDoctorProfile for extended data (Bio, Specialty)
  useEffect(() => {
    const profileData =
      (doctorProfile as any)?.data || (doctorProfile as any)?.user;

    if (profileData) {
      const mergedValues = {
        first_name: profileData.first_name || "",
        last_name: profileData.last_name || "",
        email: profileData.email || "",
        // specialty: profileData.department_id || "",
        specialty:
          profileData.doctor_departments
            ?.map((item: any) => item.department_name)
            .join(", ") || "",
        bio: profileData.bio || "",
      };

      // console.log("Merging profile data from API:", mergedValues);

      // Only reset if we actually have new/different data to avoid unnecessary form resets
      reset(mergedValues);

      if (profileData.avatar) {
        setImage(profileData.avatar);
      }
    }
  }, [doctorProfile, reset]);

  const { mutate: updateProfile, isPending } = useUpdateDoctorProfile(
    doctorID,
    "personal_information",
  );

  const [image, setImage] = useState<string | null>(null);

  const pickImage = async () => {
    // Ask for permission
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert("Permission to access camera roll is required!");
      return;
    }

    // Pick image
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const onSubmit = (data: PersonalInfoFormData) => {

    const payload: Record<string, string> = {
      first_name: data.first_name,
      last_name: data.last_name ?? "",
      bio: data.bio ?? "",
    };

    const isNewImage =
      image && !image.startsWith("http") && !image.startsWith("/");

    const handleSuccess = (response: any) => {
      const updatedData = response?.data || response?.user;
      if (updatedData) {
        console.log("Success! Context updated with:", {
          first_name: updatedData.first_name,
          last_name: updatedData.last_name,
          avatar: updatedData.avatar,
        });
        updateUser({
          first_name: updatedData.first_name,
          last_name: updatedData.last_name,
          avatar: updatedData.avatar,
        });
      }
      Alert.alert("Success", "Profile information saved successfully!");
    };

    const handleError = (error: any) => {
      Alert.alert(
        "Error",
        error?.response?.data?.errors?.message || "Something went wrong",
      );
    };

    if (isNewImage) {
      const fd = new FormData();
      Object.keys(payload).forEach((key) => {
        if (payload[key]) fd.append(key, payload[key]);
      });

      const uri = image!;
      const fileName = uri.split("/").pop() || "avatar.jpg";
      const match = /\.([0-9a-z]+)(?:\?|$)/i.exec(fileName);
      const fileType = match ? `image/${match[1]}` : "image/jpeg";

      // @ts-ignore
      fd.append("avatar", { uri, name: fileName, type: fileType });

      updateProfile(fd, {
        onSuccess: handleSuccess,
        onError: handleError,
      });
    } else {
      updateProfile(payload, {
        onSuccess: handleSuccess,
        onError: handleError,
      });
    }
  };

  return (
    <FormLayout>
      {/* upload image */}
      <View className="max-w-32 w-full mx-auto items-center justify-center relative">
        <Image
          source={
            image
              ? { uri: image }
              : require("../../../assets/images/doctor.jpg")
          }
          className="w-32 h-32 rounded-full"
          resizeMode="cover"
        />
        <TouchableOpacity
          className="w-8 h-8 rounded-full bg-primary-100 absolute bottom-0 right-0 items-center justify-center"
          activeOpacity={0.7}
          onPress={pickImage}
        >
          <Camera size={16} color="#013220" />
        </TouchableOpacity>
      </View>

      {/* form fields */}
      <View className="max-w-[350px] w-full mx-auto bg-white p-5 rounded-xl mt-10">
        <View className="mb-5">
          <Input
            name="first_name"
            label="First Name"
            placeholder="Enter First Name"
            control={control}
          />

          <Input
            name="last_name"
            label="Last Name"
            placeholder="Enter Last Name"
            control={control}
            containerClassName="mt-5"
          />
          <Input
            name="specialty"
            label="Speciality"
            autoCapitalize="none"
            placeholder="clinical-haematology"
            containerClassName="mt-5"
            control={control}
            editable={false}
          />
          <TextArea
            name="bio"
            label="Bio"
            placeholder="Edit Your Bio"
            containerClassName="mt-5"
            control={control}
          />
        </View>

        <Button onPress={handleSubmit(onSubmit)} disabled={isPending}>
          {isPending ? "Saving..." : "Save"}
        </Button>
      </View>
    </FormLayout>
  );
};

export default EditPersonalInformation;
