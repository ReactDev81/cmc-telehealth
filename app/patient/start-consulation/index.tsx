import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { WherebyEmbed, type WherebyWebView } from "@whereby.com/react-native-sdk/embed";
import { Camera } from "expo-camera";
import { useLocalSearchParams } from "expo-router";
import type { LucideIcon } from "lucide-react-native";
import { ClosedCaption, MessagesSquare, Mic, MicOff, Phone, Pill, Video, VideoOff } from "lucide-react-native";
import * as React from "react";
import { Alert, Platform, Text, TouchableOpacity, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AddPrescription from "./add-prescription";
import ControlsButton from "./controls-button";


type ControlKey = "chat" | "camera" | "microphone" | "caption" | "prescription";

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
    { key: "chat", label: "Chat", icon: MessagesSquare },
    { key: "caption", label: "Caption", icon: ClosedCaption },
];

const StartConsulationWithDoctor = () => {

    const { patient_call_link } = useLocalSearchParams<{
        patient_call_link?: string;
    }>();
    
    const ROOM_URL = patient_call_link + "&bottomToolbar=off";
    
    console.log('ROOM_URL', ROOM_URL);

    const wherebyRoomRef = React.useRef<WherebyWebView>(null);
    const bottomSheetRef = React.useRef<BottomSheet>(null);

    // Add Prescription Bottom Sheet
    const addPrescriptionBottomSheetRef = React.useRef<BottomSheet>(null);

    const [hasPermissionForAndroid, setHasPermissionForAndroid] = React.useState<boolean>(false);

    const [isCameraOn, setIsCameraOn] = React.useState(true);
    const [isMicrophoneOn, setIsMicrophoneOn] = React.useState(true);
    const [isAddPrescriptionOpen, setIsAddPrescriptionOpen] = React.useState(false);
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

    const controlHandlers: Record<ControlKey, () => void> = React.useMemo(
        () => ({
            camera: handleToggleCamera,
            microphone: handleToggleMicrophone,
            caption: handleToggleCaption,
            chat: handleToggleChat,
            prescription: handleTogglePrescription,
        }),
        [
            handleToggleCaption,
            handleToggleCamera,
            handleToggleMicrophone,
            handleToggleChat,
            handleTogglePrescription,
        ],
    );

    const activeMap: Record<ControlKey, boolean> = {
        camera: isCameraOn,
        microphone: isMicrophoneOn,
        caption: isCaptionOn,
        chat: isChatOpen,
        prescription: isAddPrescriptionOpen,
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
                    <View className="h-[85%]">
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

            </View>
            <View 
                className="bg-primary"
                style={{
                    paddingBottom: Platform.OS === "ios" ? insets.bottom : insets.bottom,
                }}
            ></View>
        </GestureHandlerRootView>
    );
};

export default StartConsulationWithDoctor;