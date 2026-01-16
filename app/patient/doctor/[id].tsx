// import useAxios from "@/hooks/useApi";
// import { useLocalSearchParams } from "expo-router";
// import {
//     BriefcaseBusiness,
//     Hospital,
//     Star,
//     Stethoscope,
//     Video,
// } from "lucide-react-native";
// import { useEffect, useState } from "react";
// import {
//     Image,
//     ImageSourcePropType,
//     ScrollView,
//     Text,
//     TouchableOpacity,
//     View,
// } from "react-native";
// import DoctorSchedule from "../../../components/patient/doctor-profile/doctor-schedule";

// interface DoctorProps {
//     first_name: string;
//     last_name: string;
//     name: string;
//     avatar: ImageSourcePropType;
//     departments: { name: string; role?: string; order?: number }[];
//     years_experience: string;
//     bio: string;
//     education_info: {
//         degree: string;
//         institution: string;
//         start_date: string;
//         end_date: string;
//     }[];
//     languages?: string;
//     appointment_types?: {
//         video?: boolean;
//         in_person?: boolean;
//     };
// }

// const DoctorDetail = () => {
//     const { id } = useLocalSearchParams();

//     // console.log("ID: ", id);

//     const { data, loading, fetchData } = useAxios<{ data: DoctorProps }>(
//         "get",
//         `/patient/browse-doctor/${id}`,
//         {
//             headers: {
//                 Authorization: `Bearer ${process.env.EXPO_PUBLIC_token}`,
//             },
//         }
//     );
//     const doctor = data?.data;
//     // console.log("Doctor Data Fetching:", doctor);
//     // console.log("Doctor Data:", doctor);
//     const [appointementType, setAppointementType] = useState<"video" | "in_person" | null>(null);
//     console.log("Appointments Type Video:", doctor?.appointment_types?.video);
//     console.log("Appointments Type In Person:", doctor?.appointment_types?.in_person);

//     useEffect(() => {
//         fetchData();
//     }, []);

//     if (!doctor) {
//         return (
//             <View className="flex-1 items-center justify-center">
//                 <Text className="text-gray-600 text-lg">Doctor not found</Text>
//             </View>
//         );
//     }

//     return (
//         <ScrollView className="flex-1 bg-white">
//             <View className="items-center mb-6">
//                 <Image
//                     source={{
//                         uri:
//                             doctor?.profile?.avatar ||
//                             "https://cdn-icons-png.flaticon.com/512/387/387561.png",
//                     }}
//                     className="w-full h-60"
//                     resizeMode="cover"
//                 />
//             </View>

//             <View className="px-5 pt-7 pb-20">
//                 {/* name & speciality */}
//                 <View>
//                     <View className="flex-row gap-x-1">
//                         <Stethoscope size={15} color="#013220" />
//                         <Text className="text-primary text-sm">
//                             {doctor?.profile?.department}
//                         </Text>
//                     </View>
//                     <Text className="text-lg font-medium text-black mt-1">
//                         {doctor?.profile?.name}
//                     </Text>
//                 </View>

//                 {/* work experience & review */}
//                 <View className="flex-row items-center justify-between gap-x-4 mt-5">
//                     <View className="flex-1 flex-row items-center gap-x-2.5 border border-gray rounded-lg p-3">
//                         <View className="w-10 h-10 items-center justify-center rounded-full bg-primary-200">
//                             <BriefcaseBusiness size={18} color="#013220" />
//                         </View>
//                         <View className="flex-1">
//                             <Text className="text-base font-medium text-black">
//                                 {doctor?.profile?.years_experience} years
//                             </Text>
//                             <Text className="text-xs text-black-400 mt-1">
//                                 Work Experience
//                             </Text>
//                         </View>
//                     </View>
//                     <View className="flex-1 flex-row items-center gap-x-2.5 border border-gray rounded-lg p-3">
//                         <View className="w-10 h-10 items-center justify-center rounded-full bg-primary-200">
//                             <Star size={18} color="#013220" />
//                         </View>
//                         <View className="flex-1 ">
//                             <Text className="text-base font-medium text-black">{doctor?.review_summary?.average_rating}</Text>
//                             <Text className="text-xs text-black-400 mt-1">
//                                 Reviews ({doctor?.review_summary?.total_reviews})
//                             </Text>
//                         </View>
//                     </View>
//                 </View>

//                 {/* about doctor */}
//                 <View className="mt-6">
//                     <Text className="text-lg font-medium text-black">About Doctor</Text>
//                     <Text className="text-sm leading-6 text-black-400 mt-2">
//                         {doctor?.about?.bio}
//                     </Text>
//                 </View>

//                 {/* education */}
//                 <View className="mt-6">
//                     <Text className="text-lg font-medium text-black">Education</Text>
//                     {doctor?.education?.map((education, index) => {
//                         return (
//                             <View
//                                 key={index}
//                                 className="flex-row items-center gap-x-2.5 mt-3"
//                             >
//                                 <View className="w-2 h-2 rounded-full bg-primary"></View>
//                                 <Text className="text-sm text-black-400">
//                                     {education.degree}, {education.institution}
//                                 </Text>
//                             </View>
//                         );
//                     })}
//                 </View>

//                 {/* Languages */}
//                 <View className="mt-6">
//                     <Text className="text-lg font-medium text-black">Languages</Text>
//                     <View className="flex-row items-center gap-x-2.5 mt-3 flex-wrap">
//                         {doctor?.languages?.split(',').map((language, index) => (
//                             <View
//                                 key={index}
//                                 className="px-4 py-1.5 border border-gray bg-primary-100 rounded-3xl mb-1.5"
//                             >
//                                 <Text className="text-sm text-black-400">
//                                     {language.trim().charAt(0).toUpperCase() +
//                                         language.trim().slice(1)}
//                                 </Text>
//                             </View>
//                         ))}
//                     </View>
//                 </View>

//                 {/* Appointment */}
//                 <View className="mt-6">
//                     <Text className="text-lg font-medium text-black">
//                         Appointment type
//                     </Text>
//                     <View className="flex-row items-center mt-4 gap-x-4">
//                         {doctor?.appointment_types?.video && (
//                             <TouchableOpacity
//                                 onPress={() => setAppointementType("video")}
//                                 activeOpacity={1}
//                                 className={`flex-1 items-center justify-center border rounded-xl p-4 ${appointementType === "video"
//                                     ? "border-primary"
//                                     : "border-gray"
//                                     }`}
//                             >
//                                 <Video
//                                     color={appointementType === "video" ? "#013220" : "#4D4D4D"}
//                                 />
//                                 <Text
//                                     className={`text-sm font-medium text-center mt-2 ${appointementType === "video"
//                                         ? "text-primary"
//                                         : "text-black-400"
//                                         }`}
//                                 >
//                                     Online Video Appointment
//                                 </Text>
//                             </TouchableOpacity>
//                         )}
//                         {doctor?.appointment_types?.in_person && (
//                             <TouchableOpacity
//                                 onPress={() => setAppointementType("in_person")}
//                                 activeOpacity={1}
//                                 className={`flex-1 items-center justify-center border rounded-xl p-4 ${appointementType === "in_person"
//                                     ? "border-primary"
//                                     : "border-gray"
//                                     }`}
//                             >
//                                 <Hospital
//                                     color={
//                                         appointementType === "in_person" ? "#013220" : "#4D4D4D"
//                                     }
//                                 />
//                                 <Text
//                                     className={`text-sm font-medium text-center mt-2 ${appointementType === "in_person"
//                                         ? "text-primary"
//                                         : "text-black-400"
//                                         }`}
//                                 >
//                                     Book In-Clinic Appointment
//                                 </Text>
//                             </TouchableOpacity>
//                         )}
//                     </View>
//                 </View>

//                 {/* schedules */}
//                 <DoctorSchedule appointmentType={appointementType} />
//             </View>
//         </ScrollView>
//     );
// };

// export default DoctorDetail;


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
    id: string;
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
    languages?: string;
    appointment_types?: {
        video?: boolean;
        in_person?: boolean;
    };
}

const DoctorDetail = () => {
    const { id } = useLocalSearchParams();

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

    // console.log("Doctor Data Fetching:", data);

    const [appointementType, setAppointementType] = useState<"video" | "in_person" | null>(null);
    const [opdType, setOpdType] = useState<"general" | "private" | null>(null);

    // console.log("Appointments Type Video:", doctor?.appointment_types?.video);
    // console.log("Appointments Type In Person:", doctor?.appointment_types?.in_person);

    useEffect(() => {
        fetchData();
    }, []);

    // Reset OPD type when appointment type changes
    useEffect(() => {
        if (appointementType !== "in_person") {
            setOpdType(null);
        }
    }, [appointementType]);

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
                            <Text className="text-base font-medium text-black">{doctor?.review_summary?.average_rating}</Text>
                            <Text className="text-xs text-black-400 mt-1">
                                Reviews ({doctor?.review_summary?.total_reviews})
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
                    {/* <View className="flex-row items-center gap-x-2.5 mt-3 flex-wrap">
                        {doctor?.languages?.split(',').map((language, index) => (
                            <View
                                key={index}
                                className="px-4 py-1.5 border border-gray bg-primary-100 rounded-3xl mb-1.5"
                            >
                                <Text className="text-sm text-black-400">
                                    {language.trim().charAt(0).toUpperCase() +
                                        language.trim().slice(1)}
                                </Text>
                            </View>
                        ))}
                    </View> */}
                </View>

                {/* Appointment Type */}
                <View className="mt-6">
                    <Text className="text-lg font-medium text-black">
                        Appointment type
                    </Text>
                    <View className="flex-row items-center mt-4 gap-x-4">
                        {doctor?.appointment_types?.video && (
                            <TouchableOpacity
                                onPress={() => setAppointementType("video")}
                                activeOpacity={1}
                                className={`flex-1 items-center justify-center border rounded-xl p-4 ${appointementType === "video"
                                    ? "border-primary"
                                    : "border-gray"
                                    }`}
                            >
                                <Video
                                    color={appointementType === "video" ? "#013220" : "#4D4D4D"}
                                />
                                <Text
                                    className={`text-sm font-medium text-center mt-2 ${appointementType === "video"
                                        ? "text-primary"
                                        : "text-black-400"
                                        }`}
                                >
                                    Online Video Appointment
                                </Text>
                            </TouchableOpacity>
                        )}
                        {doctor?.appointment_types?.in_person && (
                            <TouchableOpacity
                                onPress={() => setAppointementType("in_person")}
                                activeOpacity={1}
                                className={`flex-1 items-center justify-center border rounded-xl p-4 ${appointementType === "in_person"
                                    ? "border-primary"
                                    : "border-gray"
                                    }`}
                            >
                                <Hospital
                                    color={
                                        appointementType === "in_person" ? "#013220" : "#4D4D4D"
                                    }
                                />
                                <Text
                                    className={`text-sm font-medium text-center mt-2 ${appointementType === "in_person"
                                        ? "text-primary"
                                        : "text-black-400"
                                        }`}
                                >
                                    Book In-Clinic Appointment
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>

                {/* OPD Type - Only show when in_person is selected */}
                {appointementType === "in_person" && (
                    <View className="mt-6">
                        <Text className="text-lg font-medium text-black">
                            OPD Type
                        </Text>
                        <View className="flex-row items-center mt-4 gap-x-4">
                            <TouchableOpacity
                                onPress={() => setOpdType("general")}
                                activeOpacity={1}
                                className={`flex-1 items-center justify-center border rounded-xl p-4 ${opdType === "general"
                                    ? "border-primary bg-primary-100"
                                    : "border-gray"
                                    }`}
                            >
                                <Text
                                    className={`text-sm font-medium text-center ${opdType === "general"
                                        ? "text-primary"
                                        : "text-black-400"
                                        }`}
                                >
                                    General OPD
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => setOpdType("private")}
                                activeOpacity={1}
                                className={`flex-1 items-center justify-center border rounded-xl p-4 ${opdType === "private"
                                    ? "border-primary bg-primary-100"
                                    : "border-gray"
                                    }`}
                            >
                                <Text
                                    className={`text-sm font-medium text-center ${opdType === "private"
                                        ? "text-primary"
                                        : "text-black-400"
                                        }`}
                                >
                                    Private OPD
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}

                {/* schedules - Only show when appointment type is selected and if in_person, opdType must be selected */}
                {appointementType && (appointementType === "video" || (appointementType === "in_person" && opdType)) && (
                    <DoctorSchedule doctorData={data} appointmentType={appointementType} opdType={opdType} />
                )}
            </View>
        </ScrollView>
    );
};

export default DoctorDetail;