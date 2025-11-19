import * as React from "react";
import { View, Alert, Platform, Text, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Camera } from "expo-camera";
import { Phone, FileUser, Pill, MessagesSquare, Video, VideoOff, Mic, MicOff, ClosedCaption} from "lucide-react-native";
import type { LucideIcon } from "lucide-react-native";
import { WherebyEmbed, type WherebyWebView } from "@whereby.com/react-native-sdk/embed";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import ControlsButton from "./controls-button";
import AddPrescription from "./add-prescription";
import PatientDetails from "./patient-details";
const ROOM_URL = process.env.EXPO_PUBLIC_PATIENT_CALL_LINK + "?bottomToolbar=off";

type ControlKey = "chat" | "camera" | "microphone" | "caption" | "prescription" | "patient_details";

type ControlConfig = {
    key: ControlKey;
    label: string;
    icon: LucideIcon;
    inactiveIcon?: LucideIcon;
};

const CONTROLS: ControlConfig[] = [
    { key: "chat", label: "Chat", icon: MessagesSquare },
    { key: "camera", label: "Camera", icon: Video, inactiveIcon: VideoOff },
    { key: "microphone", label: "Mic", icon: Mic, inactiveIcon: MicOff },
    { key: "caption", label: "Caption", icon: ClosedCaption },
    { key: "prescription", label: "Prescription", icon: Pill },
    { key: "patient_details", label: "Patient Details", icon: FileUser },
];

const StartConsulationWithDoctor = () => {

    const wherebyRoomRef = React.useRef<WherebyWebView>(null);
    const bottomSheetRef = React.useRef<BottomSheet>(null);

    // Add Prescription Bottom Sheet
    const addPrescriptionBottomSheetRef = React.useRef<BottomSheet>(null);
    
    // Patient Details Bottom Sheet
    const patientDetailsBottomSheetRef = React.useRef<BottomSheet>(null);

    const [hasPermissionForAndroid, setHasPermissionForAndroid] = React.useState<boolean>(false);

    const [isCameraOn, setIsCameraOn] = React.useState(true);
    const [isMicrophoneOn, setIsMicrophoneOn] = React.useState(true);
    const [isChatOpen, setIsChatOpen] = React.useState(false);
    const [isCaptionOn, setIsCaptionOn] = React.useState(false);
    const [isAddPrescriptionOpen, setIsAddPrescriptionOpen] = React.useState(false);
    const [isPatientDetailsOpen, setIsPatientDetailsOpen] = React.useState(false);

    const [isLeaving, setIsLeaving] = React.useState(false);
    const [isJoined, setIsJoined] = React.useState(false);

    const [isBottomSheetExpanded, setIsBottomSheetExpanded] = React.useState<boolean>(false);

    const insets = useSafeAreaInsets();

    const handleSheetChanges = React.useCallback((index: number) => {
        console.log("handleSheetChanges", index);
        setIsBottomSheetExpanded(index === 1);
    }, []);

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
        if (isLeaving) {
            return;
        }
        setIsLeaving(true);
        wherebyRoomRef.current?.leaveRoom();
        setTimeout(() => setIsLeaving(false), 1200);
    }, [isLeaving]);

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
            console.warn("Unable to toggle captions", error);
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
            chat: handleToggleChat,
            camera: handleToggleCamera,
            microphone: handleToggleMicrophone,
            caption: handleToggleCaption,
            prescription: handleTogglePrescription,
            patient_details: handleTogglePatientDetails,
        }),
        [
            handleToggleCaption,
            handleToggleCamera,
            handleToggleChat,
            handleToggleMicrophone,
            handleTogglePrescription,
            handleTogglePatientDetails,
        ],
    );

    const activeMap: Record<ControlKey, boolean> = {
        chat: isChatOpen,
        camera: isCameraOn,
        microphone: isMicrophoneOn,
        caption: isCaptionOn,
        prescription: isAddPrescriptionOpen,
        patient_details: isPatientDetailsOpen,
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
                    <View className="h-[80%]">
                        <WherebyEmbed
                            ref={wherebyRoomRef}
                            style={{ marginTop: isJoined ? -31 : 0 }}
                            room={ROOM_URL ?? ""}
                            skipMediaPermissionPrompt
                            onWherebyMessage={(event) => {
                                console.log(event);
                            }}
                            onReady={() => {
                                console.log("ready");
                            }}
                            onJoin={() => {
                                console.log("User joined the room");
                                setIsJoined(true);
                            }}
                            onLeave={({ removed }) => {
                                console.log("User left the room", { removed });
                                setIsJoined(false);
                            }}
                            onMicrophoneToggle={({ enabled }) => setIsMicrophoneOn(enabled)}
                            onCameraToggle={({ enabled }) => setIsCameraOn(enabled)}
                            onChatToggle={({ open }) => setIsChatOpen(open)}
                            onTranscriptionStatusChange={({ status }) => setIsCaptionOn(status === "started")}
                        />
                    </View>
                </View>

                {/* Bottom Bar - Only show when joined */}
                {isJoined && (
                    <BottomSheet
                        ref={bottomSheetRef}
                        index={0}
                        snapPoints={["18%"]}
                        onChange={handleSheetChanges}
                        backgroundStyle={{ backgroundColor: "#013220" }}
                        handleIndicatorStyle={{ backgroundColor: "#ccc", width: 40 }}
                    >
                        <BottomSheetView style={{ flex: 1 }}>
                            <View
                                className="flex-row flex-wrap justify-center gap-y-5 bg-primary px-5 pb-3 pt-5"
                                style={{
                                    paddingBottom: Platform.OS === "ios" ? 10 + insets.bottom : 10 + insets.bottom,
                                }}
                            >
                                {CONTROLS.slice(0, isBottomSheetExpanded ? CONTROLS.length : 4).map((item) => {
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
                        index={1}
                        snapPoints={["80%"]}
                        enablePanDownToClose={true}
                        onChange={handlePrescriptionSheetChange}
                        backgroundStyle={{ backgroundColor: "#fff" }}
                        handleIndicatorStyle={{ width: 0 }}
                    >
                        <BottomSheetView style={{ flex: 1 }}>
                            <AddPrescription onClose={() => setIsAddPrescriptionOpen(false)} />
                        </BottomSheetView>
                    </BottomSheet>
                }

                {/* Add Prescription Bottom Sheet */}
                {
                    isPatientDetailsOpen &&
                    <BottomSheet
                        ref={patientDetailsBottomSheetRef}
                        index={1}
                        snapPoints={["80%"]}
                        enablePanDownToClose={true}
                        onChange={handlePatientDetailsSheetChange}
                        backgroundStyle={{ backgroundColor: "#fff" }}
                        handleIndicatorStyle={{ width: 0 }}
                    >
                        <BottomSheetView style={{ flex: 1 }}>
                            <PatientDetails onClose={() => setIsPatientDetailsOpen(false)} />
                        </BottomSheetView>
                    </BottomSheet>
                }

            </View>
        </GestureHandlerRootView>
    );
};

export default StartConsulationWithDoctor;