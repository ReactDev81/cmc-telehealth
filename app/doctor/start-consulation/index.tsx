import { useAuth } from "@/context/UserContext";
import { useMarkAsCompleted } from "@/queries/doctor/useMarkAsCompleted";
import BottomSheet, { BottomSheetScrollView, BottomSheetView } from "@gorhom/bottom-sheet";
import { WherebyEmbed, type WherebyWebView } from "@whereby.com/react-native-sdk/embed";
import { Camera } from "expo-camera";
import { useLocalSearchParams, useRouter } from "expo-router";
import type { LucideIcon } from "lucide-react-native";
import { ClosedCaption, FileUser, MessagesSquare, Mic, MicOff, Phone, Pill, Video, VideoOff, X } from "lucide-react-native";
import * as React from "react";
import { Alert, Dimensions, Platform, Text, TouchableOpacity, View, useWindowDimensions } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AddPrescription from "./add-prescription";
import ControlsButton from "./controls-button";
import PatientDetails from "./patient-details";

type ControlKey = "chat" | "camera" | "microphone" | "caption" | "prescription" | "patient_details";

type ControlConfig = {
    key: ControlKey;
    label: string;
    icon: LucideIcon;
    inactiveIcon?: LucideIcon;
};

const CONTROLS: ControlConfig[] = [
    { key: "camera", label: "Camera", icon: Video, inactiveIcon: VideoOff },
    { key: "microphone", label: "Mic", icon: Mic, inactiveIcon: MicOff },
    { key: "prescription", label: "Prescription", icon: Pill },
    { key: "patient_details", label: "Patient Details", icon: FileUser },
    { key: "chat", label: "Chat", icon: MessagesSquare },
    { key: "caption", label: "Caption", icon: ClosedCaption },
];

const MAX_BOTTOM_SHEET_HEIGHT = Dimensions.get("window").height * 0.8;

const StartConsulationWithDoctor = () => {
    const router = useRouter();
    const { token } = useAuth();
    const { mutate: markAsCompleted, isPending: isMarkingComplete } = useMarkAsCompleted();

    const { doctor_call_link, appointment_id } = useLocalSearchParams<{ doctor_call_link: string, appointment_id: string }>();

    const ROOM_URL = React.useMemo(() => {
        const baseUrl = doctor_call_link?.trim();
        if (!baseUrl) {
            return "";
        }
        try {
            const url = new URL(baseUrl);
            url.searchParams.set("bottomToolbar", "off");
            const finalUrl = url.toString();
            return finalUrl;
        } catch (error) {
            const separator = baseUrl.includes("?") ? "&" : "?";
            const finalUrl = `${baseUrl}${separator}bottomToolbar=off`;
            return finalUrl;
        }
    }, [doctor_call_link]);

    const { height } = useWindowDimensions();
    const calcHeight = height - 180;

    const wherebyRoomRef = React.useRef<WherebyWebView>(null);
    const bottomSheetRef = React.useRef<BottomSheet>(null);

    // Add Prescription Bottom Sheet
    const addPrescriptionBottomSheetRef = React.useRef<BottomSheet>(null);

    // Patient Details Bottom Sheet
    const patientDetailsBottomSheetRef = React.useRef<BottomSheet>(null);
    const [hasPermissionForAndroid, setHasPermissionForAndroid] = React.useState<boolean>(false);
    const [isCameraOn, setIsCameraOn] = React.useState(true);
    const [isMicrophoneOn, setIsMicrophoneOn] = React.useState(true);
    const [isAddPrescriptionOpen, setIsAddPrescriptionOpen] = React.useState(false);
    const [isPatientDetailsOpen, setIsPatientDetailsOpen] = React.useState(false);
    const [isChatOpen, setIsChatOpen] = React.useState(false);
    const [isCaptionOn, setIsCaptionOn] = React.useState(false);
    const [isLeaving, setIsLeaving] = React.useState(false);
    const [isJoined, setIsJoined] = React.useState(false);

    const insets = useSafeAreaInsets();

    React.useEffect(() => {
        (async () => {
            if (Platform.OS === "android") {
                const cameraStatus = await Camera.requestCameraPermissionsAsync();
                const audioStatus = await Camera.requestMicrophonePermissionsAsync();

                if (cameraStatus.status === "granted" && audioStatus.status === "granted") {
                    setHasPermissionForAndroid(true);
                } else {
                    Alert.alert("Permissions Required", "Camera and microphone permissions are required.");
                    setHasPermissionForAndroid(false);
                }
            } else {
                setHasPermissionForAndroid(true);
            }
        })();
    }, []);

    const handleHangup = React.useCallback(() => {
        if (isLeaving || isMarkingComplete) {
            Alert.alert("Please wait", isMarkingComplete ? "Completing appointment..." : "Leaving the room...");
            return;
        }

        Alert.alert(
            "End Consultation",
            "Are you sure you want to end this consultation and mark it as completed?",
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Hangup cancelled"),
                    style: "cancel",
                },
                {
                    text: "End & Complete",
                    onPress: () => {
                        if (!appointment_id || !token) {
                            Alert.alert("Error", "Missing information to complete appointment");
                            return;
                        }

                        markAsCompleted(
                            { appointmentId: appointment_id, token: token },
                            {
                                onSuccess: () => {
                                    setIsLeaving(true);
                                    wherebyRoomRef.current?.leaveRoom();

                                    // Redirect to my appointments
                                    router.replace("/(doctor)");
                                },
                                onError: (error: any) => {
                                    const errorData = error.response?.data;
                                    const devMessage = errorData?.message || error.message;
                                    const validationErrors = errorData?.errors;
                                    const fullMessage = validationErrors
                                        ? `${devMessage}: ${JSON.stringify(validationErrors)}`
                                        : (errorData ? JSON.stringify(errorData) : devMessage);

                                    Alert.alert("Error", fullMessage || "Failed to mark as completed");
                                }
                            }
                        );
                    },
                    style: "destructive",
                },
            ]
        );
    }, [isLeaving, isMarkingComplete, appointment_id, token, markAsCompleted, router]);

    const handleToggleCamera = React.useCallback(() => {
        const next = !isCameraOn;
        wherebyRoomRef.current?.toggleCamera(next);
        setIsCameraOn(next);
    }, [isCameraOn]);

    const handleToggleMicrophone = React.useCallback(() => {
        const next = !isMicrophoneOn;
        wherebyRoomRef.current?.toggleMicrophone(next);
        setIsMicrophoneOn(next);
    }, [isMicrophoneOn]);

    const handleToggleChat = React.useCallback(() => {
        const next = !isChatOpen;

        wherebyRoomRef.current?.toggleChat(next);
        setIsChatOpen(next);

        if (next) {
            // Collapse sheet
            bottomSheetRef.current?.snapToIndex?.(0);
        } else {
            // Expand sheet
            bottomSheetRef.current?.snapToIndex?.(1);
        }
    }, [isChatOpen]);


    const handleToggleCaption = React.useCallback(async () => {
        try {
            const next = !isCaptionOn;
            if (next) {
                wherebyRoomRef.current?.startLiveTranscription();
            } else {
                wherebyRoomRef.current?.stopLiveTranscription();
            }
            setIsCaptionOn(next);
        } catch (error) {
            Alert.alert("Captions unavailable", "We could not update live captions for this room.");
        }
    }, [isCaptionOn]);

    const handleTogglePrescription = React.useCallback(() => {
        setIsAddPrescriptionOpen((prev) => !prev);
    }, []);

    const handlePrescriptionSheetChange = React.useCallback((index: number) => {
        if (index === -1) {
            setIsAddPrescriptionOpen(false);
        } else {
            setIsAddPrescriptionOpen(true);
        }
    }, []);

    const handleTogglePatientDetails = React.useCallback(() => {
        setIsPatientDetailsOpen((prev) => !prev);
    }, []);

    const handlePatientDetailsSheetChange = React.useCallback((index: number) => {
        if (index === -1) {
            setIsPatientDetailsOpen(false);
        } else {
            setIsPatientDetailsOpen(true);
        }
    }, []);

    const controlHandlers: Record<ControlKey, () => void> = React.useMemo(
        () => ({
            camera: handleToggleCamera,
            microphone: handleToggleMicrophone,
            prescription: handleTogglePrescription,
            patient_details: handleTogglePatientDetails,
            chat: handleToggleChat,
            caption: handleToggleCaption,
        }),
        [
            handleToggleCamera,
            handleToggleMicrophone,
            handleTogglePrescription,
            handleTogglePatientDetails,
            handleToggleChat,
            handleToggleCaption,
        ],
    );

    const activeMap: Record<ControlKey, boolean> = {
        camera: isCameraOn,
        microphone: isMicrophoneOn,
        prescription: isAddPrescriptionOpen,
        patient_details: isPatientDetailsOpen,
        chat: isChatOpen,
        caption: isCaptionOn,
    };

    if (Platform.OS === "android" && !hasPermissionForAndroid) {
        return <View />;
    }

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <View
                className="flex-1 bg-white"
                style={{
                    paddingTop: insets?.top ?? 0,
                }}
            >

                {/* Header section - Only show when joined */}
                {isJoined && (
                    <View className="bg-white px-6 py-4 flex-row items-center gap-x-4">
                        <View className="flex-1 flex-row items-start gap-x-3">
                            <View className="flex-row items-center gap-x-0.5 mt-1.5">
                                <View className="w-1 h-2 rounded-full bg-primary"></View>
                                <View className="w-1 h-4 rounded-full bg-primary"></View>
                                <View className="w-1 h-6 rounded-full bg-primary"></View>
                                <View className="w-1 h-3 rounded-full bg-primary"></View>
                                <View className="w-1 h-4 rounded-full bg-primary"></View>
                            </View>
                            <View>
                                <Text className="text-sm text-black font-medium">Dr. Andrew Miller</Text>
                                <Text className="text-xs text-black-400 mt-1">25:12 remaining (30 mins visit)</Text>
                            </View>
                        </View>
                        <TouchableOpacity
                            className={`w-11 h-10 rounded-xl bg-danger items-center justify-center ${isLeaving ? "opacity-60" : ""}`}
                            activeOpacity={0.8}
                            onPress={handleHangup}
                        >
                            <View className="rotate-[135deg]">
                                <Phone size={16} color="#fff" fill="#fff" />
                            </View>
                        </TouchableOpacity>
                    </View>
                )}

                {/* Video Container - Middle Section */}
                <View className="bg-primary flex-1">
                    <View 
                        // className="h-[85%]"
                        style={{
                            height: calcHeight
                        }}
                    >
                        {ROOM_URL ? (
                            <WherebyEmbed
                                ref={wherebyRoomRef}
                                style={{ marginTop: isJoined ? -31 : 0 }}
                                room={ROOM_URL}
                                skipMediaPermissionPrompt
                                onWherebyMessage={(event) => {
                                    // console.log("Whereby message:", event);
                                }}
                                onReady={() => {
                                    // console.log("Whereby ready with room URL:", ROOM_URL);
                                }}
                                onJoin={() => {
                                    setIsJoined(true);
                                }}
                                onLeave={({ removed }) => {
                                    setIsJoined(false);
                                }}
                                onMicrophoneToggle={({ enabled }) => setIsMicrophoneOn(enabled)}
                                onCameraToggle={({ enabled }) => setIsCameraOn(enabled)}
                                onChatToggle={({ open }) => setIsChatOpen(open)}
                                onTranscriptionStatusChange={({ status }) => setIsCaptionOn(status === "started")}
                            />
                        ) : (
                            <View className="flex-1 items-center justify-center">
                                <Text className="text-white">Loading room URL...</Text>
                            </View>
                        )}
                    </View>
                </View>

                {/* Bottom Bar - Only show when joined */}
                {isJoined && (
                    <BottomSheet
                        ref={bottomSheetRef}
                        index={0}
                        snapPoints={["14%"]}
                        backgroundStyle={{
                            backgroundColor: "#013220",
                            borderTopLeftRadius: 0,
                            borderTopRightRadius: 0
                        }}
                        handleIndicatorStyle={{ backgroundColor: "#ccc", width: 40 }}
                    >
                        <BottomSheetView style={{ flex: 1 }}>
                            <View className="flex-row flex-wrap justify-center gap-y-5 bg-primary px-5 pb-3 pt-5">
                                {CONTROLS.map((item) => {
                                    const isActive = activeMap[item.key];
                                    const iconComponent = isActive ? item.icon : item.inactiveIcon ?? item.icon;
                                    return (
                                        <ControlsButton
                                            key={item.key}
                                            action={controlHandlers[item.key]}
                                            isActive={isActive}
                                            label={item.label}
                                            icon={iconComponent}
                                        />
                                    );
                                })}
                            </View>
                        </BottomSheetView>
                    </BottomSheet>
                )}

                {/* Add Prescription Bottom Sheet */}
                {
                    isAddPrescriptionOpen &&
                    <BottomSheet
                        ref={addPrescriptionBottomSheetRef}
                        index={0}
                        snapPoints={["80%"]}
                        enablePanDownToClose={true}
                        onChange={handlePrescriptionSheetChange}
                        backgroundStyle={{ backgroundColor: "#fff" }}
                        handleIndicatorStyle={{ width: 0 }}
                    >
                        <BottomSheetScrollView
                            stickyHeaderIndices={[0]}
                            keyboardShouldPersistTaps="handled"
                        >
                            {/* Header */}
                            <View
                                className='flex-row items-center justify-between p-5 pt-0 bg-white'
                                style={{
                                    boxShadow: '0px 0px 4px 0px rgba(0, 0, 0, 0.25)'
                                }}
                            >
                                <Text className='text-lg font-medium text-black'>Prescription</Text>
                                <TouchableOpacity onPress={() => setIsAddPrescriptionOpen(false)}>
                                    <X color="#1F1E1E" size={18} strokeWidth={2.5} />
                                </TouchableOpacity>
                            </View>
                            <AddPrescription />
                        </BottomSheetScrollView>
                    </BottomSheet>
                }

                {/* Patient Details Bottom Sheet */}
                {
                    isPatientDetailsOpen &&
                    <BottomSheet
                        ref={patientDetailsBottomSheetRef}
                        index={0}
                        snapPoints={['80%']}
                        enablePanDownToClose={true}
                        maxDynamicContentSize={MAX_BOTTOM_SHEET_HEIGHT}
                        onChange={handlePatientDetailsSheetChange}
                        backgroundStyle={{ backgroundColor: "#fff" }}
                        handleIndicatorStyle={{ width: 0, height: 0 }}
                    >
                        <BottomSheetScrollView
                            stickyHeaderIndices={[0]}
                            keyboardShouldPersistTaps="handled"
                        >
                            {/* Header */}
                            <View
                                className='flex-row items-center justify-between p-5 pt-0 bg-white'
                                style={{
                                    boxShadow: '0px 0px 4px 0px rgba(0, 0, 0, 0.25)'
                                }}
                            >
                                <Text className='text-lg font-medium text-black'>Patient Detail</Text>
                                <TouchableOpacity onPress={() => setIsPatientDetailsOpen(false)}>
                                    <X color="#1F1E1E" size={18} strokeWidth={2.5} />
                                </TouchableOpacity>
                            </View>
                            <PatientDetails appointmentId={appointment_id} />
                        </BottomSheetScrollView>
                    </BottomSheet>
                }

            </View>
            <View
                className="bg-primary"
                style={{
                    paddingBottom: Platform.OS === "ios" ? insets.bottom : insets.bottom,
                }}
            ></View>
        </GestureHandlerRootView>
    )
}

export default StartConsulationWithDoctor