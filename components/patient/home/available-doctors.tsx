import Button from "@/components/ui/Button";
import { AvailableDoctorsProps } from "@/types/patient/home";
import { Link, router } from "expo-router";
import { ChevronRight, Star } from "lucide-react-native";
import React from "react";
import { Image, Text, View } from "react-native";

const AvailableDoctors = ({
    avatar,
    name,
    id,
    speciality,
    rating,
    consultation_type,
    consultation_fee,
    years_experience,
    fees_breakdown
}: AvailableDoctorsProps) => {

    const experience = years_experience ? `(${years_experience} Years Exp)` : "";
    const default_avatar = "https://cdn-icons-png.flaticon.com/512/387/387561.png";

    const doctor_speciality = Array.isArray(speciality)
        ? speciality
            .map((item) =>
                typeof item === "string" ? item : item?.name
            )
            .filter(Boolean)
            .join(", ")
        : "";

    const imageSource =
        typeof avatar === "string"
            ? { uri: avatar }
            : (avatar ?? { uri: default_avatar });

    const feeItems = [
        fees_breakdown?.video_consultation && {
            label: "Video Consultation",
            shortLabel: "Video\nConsultation",
            value: fees_breakdown.video_consultation,
        },
        fees_breakdown?.clinic_visit?.private && {
            label: "Private OPD",
            shortLabel: "Private\nOPD",
            value: fees_breakdown.clinic_visit.private,
        },
        fees_breakdown?.clinic_visit?.general && {
            label: "General OPD",
            shortLabel: "General\nOPD",
            value: fees_breakdown.clinic_visit.general,
        },
        ].filter(Boolean);
              
    const shouldBreakLine = feeItems.length === 3;

    return (
        <View className="border border-black-300 rounded-xl p-4 mt-4 min-w-[300px]">

            <Link
                href={{
                    pathname: `/patient/doctor/${id}` as any,
                    params: { booking_type: "new appointment" },
                }}
            >
                <View className="flex-row items-center gap-x-2">
                    <View>
                        <Image source={imageSource} className="w-14 h-14 rounded-full" />
                    </View>
                    <View className="flex-1">
                        <Text className="text-sm text-black font-medium">{name}</Text>
                        <Text className="text-xs text-black mt-1.5">
                            {doctor_speciality ? doctor_speciality : 'no department'}
                            {' '}
                            {experience}
                        </Text>
                        {rating > 0 &&
                            (
                                <View className="py-1 px-2 bg-primary-100 rounded-lg flex-row items-center gap-x-1 absolute top-0 right-0">
                                    <Star size={12} fill="#013220" />
                                    <Text className="text-primary text-sm font-medium">{rating}</Text>
                                </View>
                            )
                        }
                    </View>
                </View>
            </Link>

            <View className="p-4 bg-primary-100 rounded-lg mt-3">
                {/* <View className="flex-row items-center justify-between gap-x-5">

                    <View>
                        <Text className="text-sm text-black font-medium">
                            Consultation Type
                        </Text>

                        <View className="flex-row items-center gap-x-1.5 mt-1">
                            {consultation_type === "video" ? (
                                <>
                                    <Video color="#1ABE17" fill="#1ABE17" size={14} />
                                    <Text className="text-success text-sm">{consultation_type}</Text>
                                </>

                            ) :
                                consultation_type === "both" ? (
                                    <>
                                        <Video color="#1ABE17" fill="#1ABE17" size={14} />
                                        <Text className="text-success text-sm">Video</Text>
                                        <View className="w-[1px] h-full bg-primary-200"></View>
                                        <Hospital color="#055bd9" size={14} />
                                        <Text className="text-[#055bd9] text-sm">In Person</Text>
                                    </>

                                )
                                    : (
                                        <>
                                            <Hospital color="#055bd9" size={14} />
                                            <Text className="text-[#055bd9] text-sm">In Person</Text>
                                        </>
                                    )}

                        </View>
                    </View>

                    <View className="w-px h-full bg-primary-200"></View>
                    <View>
                        <Text className="text-right text-sm text-black font-medium">
                            Consultation Fee
                        </Text>
                        <Text className="text-right text-sm text-black-400 mt-1">
                            ₹{consultation_fee}
                        </Text>
                    </View>
                </View> */}
                

                <View className="flex-row items-center">
                    {feeItems.map((item: any, index) => (
                        <React.Fragment key={index}>
                            <View className="flex-1 items-center">
                                <Text className="text-sm font-medium text-black text-center">
                                    {shouldBreakLine ? item.shortLabel : item.label}
                                </Text>

                                <Text className="text-sm text-black-400 mt-1 text-center">
                                    ₹{item.value}
                                </Text>
                            </View>

                            {index !== feeItems.length - 1 && (
                                <View className="w-px h-14 bg-primary-200" />
                            )}
                        </React.Fragment>
                    ))}
                </View>

                <Button
                    className="mt-3 flex-row-reverse"
                    icon={<ChevronRight color="#fff" size={16} strokeWidth={3} />}
                    onPress={() => router.push({
                        pathname: `/patient/doctor/${id}` as any,
                        params: {
                            booking_type: "new appointment"
                        },
                    })}
                >
                    Book Appointment
                </Button>

            </View>
        </View>
    );
};

export default AvailableDoctors;
