import * as React from "react";
import { View, Alert, Platform, Text, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Camera } from "expo-camera";
import * as DocumentPicker from "expo-document-picker";
import { Ionicons } from "@expo/vector-icons";
import { Phone } from 'lucide-react-native';
import { WherebyEmbed, type WherebyWebView } from "@whereby.com/react-native-sdk/embed";

const ROOM_URL = process.env.EXPO_PUBLIC_PATIENT_CALL_LINK + "?bottomToolbar=off"

type ControlKey = "chat" | "camera" | "microphone" | "caption" | "share";
type IconName = React.ComponentProps<typeof Ionicons>["name"];

const CONTROLS: { key: ControlKey; label: string; icon: IconName }[] = [
    { key: "chat", label: "Chat", icon: "chatbubble-ellipses" },
    { key: "camera", label: "Off", icon: "videocam-off" },
    { key: "microphone", label: "Mute", icon: "mic-off" },
    { key: "caption", label: "Caption", icon: "logo-closed-captioning" },
    { key: "share", label: "Shared File", icon: "attach" },
];

const StartConsulationWithDoctor = () => {
  
    const wherebyRoomRef = React.useRef<WherebyWebView>(null);
    const [hasPermissionForAndroid, setHasPermissionForAndroid] = React.useState<boolean>(false);
    const [isCameraOn, setIsCameraOn] = React.useState(true);
    const [isMicrophoneOn, setIsMicrophoneOn] = React.useState(true);
    const [isChatOpen, setIsChatOpen] = React.useState(false);
    const [isCaptionOn, setIsCaptionOn] = React.useState(false);
    const [sharedFileName, setSharedFileName] = React.useState<string | null>(null);
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
            }
        })();
    }, []);

    const handleHangup = React.useCallback(() => {
        if (isLeaving) {
            return;
        }
        setIsLeaving(true);
        wherebyRoomRef.current?.leaveRoom();
        Alert.alert("Call ended", "You have left the consultation.");
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

    const handleShareFile = React.useCallback(async () => {
        try {
            const file = await DocumentPicker.getDocumentAsync({
                type: "*/*",
                copyToCacheDirectory: true,
            });

            if (file.canceled) {
                return;
            }

            const picked = file.assets?.[0];
            if (picked) {
                setSharedFileName(picked.name ?? picked.uri.split("/").pop() ?? "Selected file");
                Alert.alert("File ready to share", picked.name ?? "Attachment selected");
            }
        } catch (error) {
            console.warn("Document picker error", error);
            Alert.alert("File share failed", "We couldn't access your files. Please try again.");
        }
    }, []);

    const controlHandlers: Record<ControlKey, () => void> = React.useMemo(
        () => ({
            chat: handleToggleChat,
            camera: handleToggleCamera,
            microphone: handleToggleMicrophone,
            caption: handleToggleCaption,
            share: handleShareFile,
        }),
        [handleShareFile, handleToggleCaption, handleToggleCamera, handleToggleChat, handleToggleMicrophone],
    );

    const activeMap: Record<ControlKey, boolean> = {
        chat: isChatOpen,
        camera: !isCameraOn,
        microphone: !isMicrophoneOn,
        caption: isCaptionOn,
        share: Boolean(sharedFileName),
    };

    if (Platform.OS === "android" && !hasPermissionForAndroid) {
        return <View />;
    }
  
    return(
        <View className="flex-1 bg-white" 
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
            <View className="flex-1 bg-primary">
                <WherebyEmbed
                    ref={wherebyRoomRef}
                    style={{ marginTop: isJoined ? -31 : 0, flex: 1 }}
                    room={ROOM_URL ?? ""}
                    skipMediaPermissionPrompt
                    onWherebyMessage={(event) => {
                        console.log(event);
                    }}
                    onReady={() => {
                        console.log("ready");
                    }}
                    onJoin={() => {
                        // User has been let in by the host
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

            {/* Bottom Bar - Only show when joined */}
            {isJoined && (
                <View 
                    className="flex-row justify-between bg-primary px-5 pb-3 pt-5"
                    style={{
                        paddingBottom: Platform.OS === 'ios' ? 10 + insets.bottom : 10 + insets.bottom,
                    }}
                >
                    {CONTROLS.map((item) => {
                        const isActive = activeMap[item.key];
                        return (
                            <TouchableOpacity
                                key={item.key}
                                className="items-center flex-1"
                                activeOpacity={0.7}
                                onPress={controlHandlers[item.key]}
                            >
                                <View className={`w-12 h-12 rounded-xl items-center justify-center mb-2 ${
                                    isActive ? "bg-white" : "bg-white/60"
                                }`}>
                                    <Ionicons
                                        name={item.icon}
                                        size={22}
                                        color={isActive ? "#013220" : "#fff"}
                                    />
                                </View>
                                <Text className={`text-xs ${isActive ? "text-white font-semibold" : "text-white/80"}`}>
                                    {item.label}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            )}

        </View>
    )
}

export default StartConsulationWithDoctor