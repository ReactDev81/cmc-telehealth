import useAxios from "@/hooks/useApi";
import { useLocalSearchParams } from "expo-router";
import {
  BriefcaseBusiness,
  Hospital,
  Star,
  Stethoscope,
  Video,
} from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  Image,
  ImageSourcePropType,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import DoctorSchedule from "../../../components/patient/doctor-profile/doctor-schedule";

interface DoctorProps {
  first_name: string;
  last_name: string;
  name: string;
  avatar: ImageSourcePropType;
  departments: { name: string; role?: string; order?: number }[];
  years_experience: string;
  bio: string;
  education_info: {
    degree: string;
    institution: string;
    start_date: string;
    end_date: string;
  }[];
}

const DoctorDetail = () => {
  const { id } = useLocalSearchParams();

  console.log("ID: ", id);

  const { data, loading, fetchData } = useAxios<{ data: DoctorProps }>(
    "get",
    `/patient/browse-doctor/${id}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.EXPO_PUBLIC_token}`,
      },
    }
  );
  const doctor = data?.data;
  console.log("Doctor Data:", doctor);
  const [appointementType, setAppointementType] = useState("online");

  useEffect(() => {
    fetchData();
  }, []);

  if (!doctor) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-gray-600 text-lg">Doctor not found</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="items-center mb-6">
        <Image
          source={{
            uri:
              doctor?.profile?.avatar ||
              "https://cdn-icons-png.flaticon.com/512/387/387561.png",
          }}
          className="w-full h-60"
          resizeMode="cover"
        />
      </View>

      <View className="px-5 pt-7 pb-20">
        {/* name & speciality */}
        <View>
          <View className="flex-row gap-x-1">
            <Stethoscope size={15} color="#013220" />
            <Text className="text-primary text-sm">
              {doctor?.profile?.department}
            </Text>
          </View>
          <Text className="text-lg font-medium text-black mt-1">
            {doctor?.profile?.name}
          </Text>
        </View>

        {/* work experience & review */}
        <View className="flex-row items-center justify-between gap-x-4 mt-5">
          <View className="flex-1 flex-row items-center gap-x-2.5 border border-gray rounded-lg p-3">
            <View className="w-10 h-10 items-center justify-center rounded-full bg-primary-200">
              <BriefcaseBusiness size={18} color="#013220" />
            </View>
            <View className="flex-1">
              <Text className="text-base font-medium text-black">
                {doctor?.profile?.years_experience} years
              </Text>
              <Text className="text-xs text-black-400 mt-1">
                Work Experience
              </Text>
            </View>
          </View>
          <View className="flex-1 flex-row items-center gap-x-2.5 border border-gray rounded-lg p-3">
            <View className="w-10 h-10 items-center justify-center rounded-full bg-primary-200">
              <Star size={18} color="#013220" />
            </View>
            <View className="flex-1 ">
              <Text className="text-base font-medium text-black">4.8</Text>
              <Text className="text-xs text-black-400 mt-1">
                Reviews (3.213)
              </Text>
            </View>
          </View>
        </View>

        {/* about doctor */}
        <View className="mt-6">
          <Text className="text-lg font-medium text-black">About Doctor</Text>
          <Text className="text-sm leading-6 text-black-400 mt-2">
            {doctor?.about?.bio}
          </Text>
        </View>

        {/* education */}
        <View className="mt-6">
          <Text className="text-lg font-medium text-black">Education</Text>
          {doctor?.education?.map((education, index) => {
            return (
              <View
                key={index}
                className="flex-row items-center gap-x-2.5 mt-3"
              >
                <View className="w-2 h-2 rounded-full bg-primary"></View>
                <Text className="text-sm text-black-400">
                  {education.degree}, {education.institution}
                </Text>
              </View>
            );
          })}
        </View>

        {/* Languages */}
        <View className="mt-6">
          <Text className="text-lg font-medium text-black">Languages</Text>
          <View className="flex-row items-center gap-x-2.5 mt-3 flex-wrap">
            {doctor?.languages?.split(",").map((language, index) => (
              <View
                key={index}
                className="px-4 py-1.5 border border-gray bg-primary-100 rounded-3xl"
              >
                <Text className="text-sm text-black-400">
                  {language.trim().charAt(0).toUpperCase() +
                    language.trim().slice(1)}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Appointment */}
        <View className="mt-6">
          <Text className="text-lg font-medium text-black">
            Appointment type
          </Text>
          <View className="flex-row items-center mt-4 gap-x-4">
            <TouchableOpacity
              onPress={() => setAppointementType("online")}
              activeOpacity={1}
              className={`flex-1 items-center justify-center border rounded-xl p-4 ${
                appointementType === "online" ? "border-primary" : "border-gray"
              }`}
            >
              <Video
                color={appointementType === "online" ? "#013220" : "#4D4D4D"}
              />
              <Text
                className={`text-sm font-medium text-center mt-2 ${
                  appointementType === "online"
                    ? "text-primary"
                    : "text-black-400"
                }`}
              >
                Online Video Appointment
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setAppointementType("clinic")}
              activeOpacity={1}
              className={`flex-1 items-center justify-center border rounded-xl p-4 ${
                appointementType === "clinic" ? "border-primary" : "border-gray"
              }`}
            >
              <Hospital
                color={appointementType === "clinic" ? "#013220" : "#4D4D4D"}
              />
              <Text
                className={`text-sm font-medium text-center mt-2 ${
                  appointementType === "clinic"
                    ? "text-primary"
                    : "text-black-400"
                }`}
              >
                Book In-Clinic Appointment
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* schedules */}
        <DoctorSchedule />
      </View>
    </ScrollView>
  );
};

export default DoctorDetail;
