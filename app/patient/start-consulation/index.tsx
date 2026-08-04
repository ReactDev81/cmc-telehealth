import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { WherebyEmbed, type WherebyWebView } from "@whereby.com/react-native-sdk/embed";
import { Camera } from "expo-camera";
import { router, useLocalSearchParams } from "expo-router";
import type { LucideIcon } from "lucide-react-native";
import { ClosedCaption, FileText, MessagesSquare, Mic, MicOff, Phone, Pill, Video, VideoOff, X } from "lucide-react-native";
import * as React from "react";
import { Alert, Platform, Text, TouchableOpacity, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ControlsButton from "./controls-button";
import DcotorPrescriptions from "./prescriptions";


type ControlKey = "chat" | "camera" | "microphone" | "caption" | "transcription" | "prescription";

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
    { key: "transcription", label: "Transcription", icon: FileText },
    { key: "caption", label: "Caption", icon: ClosedCaption },
];

const StartConsulationWithDoctor = () => {

    const { patient_call_link, appointment_id, doctor_name, doctor_id } = useLocalSearchParams<{
        patient_call_link?: string;
        appointment_id?: string;
        doctor_name?: string;
        doctor_id?: string;
    }>();

    const ROOM_URL = patient_call_link + "&bottomToolbar=on&topToolbar=off";
    const wherebyRoomRef = React.useRef<WherebyWebView>(null);
    const bottomSheetRef = React.useRef<BottomSheet>(null);

    // Add Prescription Bottom Sheet
    const addPrescriptionBottomSheetRef = React.useRef<BottomSheet>(null);
    const [hasPermissionForAndroid, setHasPermissionForAndroid] = React.useState<boolean>(false);
    const [isCameraOn, setIsCameraOn] = React.useState(true);
    const [isMicrophoneOn, setIsMicrophoneOn] = React.useState(true);
    const [isPrescriptionOpen, setIsPrescriptionOpen] = React.useState(false);
    const [isChatOpen, setIsChatOpen] = React.useState(false);
    const [isTranscriptionOn, setIsTranscriptionOn] = React.useState(false);
    const [isCaptionOn, setIsCaptionOn] = React.useState(false);
    const [isLeaving, setIsLeaving] = React.useState(false);
    const [isJoined, setIsJoined] = React.useState(false);

    const [callDuration, setCallDuration] = React.useState(0);
    const callStartTimeRef = React.useRef<number | null>(null);
    const timerRef = React.useRef<ReturnType<typeof setInterval> | null>(null);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;

        return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
    };

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

    const handleToggleTranscription = React.useCallback(async () => {
        try {
            const next = !isTranscriptionOn;
            if (next) {
                wherebyRoomRef.current?.startLiveTranscription();
            } else {
                wherebyRoomRef.current?.stopLiveTranscription();
            }
            setIsTranscriptionOn(next);
        } catch (error) {
            Alert.alert("Transcription unavailable", "We could not update live transcription for this room.");
        }
    }, [isTranscriptionOn]);

    const handleToggleCaptionDisplay = React.useCallback(() => {
        const script = `
          (function() {
            function findClickableByText(regex) {
              const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null);
              let node;
              while (node = walker.nextNode()) {
                if (regex.test(node.textContent)) {
                  let el = node.parentElement;
                  while (el && el !== document.body) {
                    const style = window.getComputedStyle(el);
                    if (
                      el.tagName === 'BUTTON' ||
                      el.getAttribute('role') === 'button' ||
                      el.getAttribute('role') === 'menuitem' ||
                      style.cursor === 'pointer'
                    ) {
                      return el;
                    }
                    el = el.parentElement;
                  }
                }
              }
              return null;
            }
    
            function clickCaptionMenuItem() {
              const item = findClickableByText(/start live captions|stop live captions/i);
              if (item) {
                item.click();
                return true;
              }
              return false;
            }
    
            // If the menu is already open from a prior tap, just click the option directly.
            if (clickCaptionMenuItem()) {
              // done
            } else {
              const captionBtn = document.querySelector(
                '[data-testid*="caption" i], [aria-label*="caption" i], [aria-label*="subtitle" i]'
              );
              if (captionBtn) {
                captionBtn.click();
    
                let attempts = 0;
                const interval = setInterval(function () {
                  attempts++;
                  if (clickCaptionMenuItem() || attempts > 20) {
                    clearInterval(interval);
                  }
                }, 100); // polls for up to ~2s
              }
            }
          })();
          true;
        `;
        wherebyRoomRef.current?.injectJavaScript(script);
    
        setIsCaptionOn(!isCaptionOn ? true : false);
    }, [isCaptionOn]);

    const handleTogglePrescription = React.useCallback(() => {
        setIsPrescriptionOpen((prev) => !prev);
    }, []);

    const handlePrescriptionSheetChange = React.useCallback((index: number) => {
        if (index === -1) {
            setIsPrescriptionOpen(false);
        } else {
            setIsPrescriptionOpen(true);
        }
    }, []);

    const controlHandlers: Record<ControlKey, () => void> = React.useMemo(
        () => ({
            camera: handleToggleCamera,
            microphone: handleToggleMicrophone,
            chat: handleToggleChat,
            prescription: handleTogglePrescription,
            transcription: handleToggleTranscription,
            caption: handleToggleCaptionDisplay,
        }),
        [
            handleToggleCamera,
            handleToggleMicrophone,
            handleToggleChat,
            handleTogglePrescription,
            handleToggleTranscription,
            handleToggleCaptionDisplay,
        ],
    );

    const activeMap: Record<ControlKey, boolean> = {
        camera: isCameraOn,
        microphone: isMicrophoneOn,
        chat: isChatOpen,
        prescription: isPrescriptionOpen,
        transcription: isTranscriptionOn,
        caption: isCaptionOn,
    };

    const HIDE_TOOLBAR_CSS = `
        (function() {

            function findToolbarContainer() {
                const captionBtn = document.querySelector(
                '[data-testid*="caption" i], [aria-label*="caption" i], [aria-label*="subtitle" i]'
                );
                if (!captionBtn) return null;
        
                let el = captionBtn.parentElement;
                while (el && el !== document.body) {
                const rect = el.getBoundingClientRect();
                // Heuristic: the toolbar spans most of the viewport width and sits near the bottom.
                if (rect.width > window.innerWidth * 0.6 && rect.bottom > window.innerHeight * 0.7) {
                    return el;
                }
                el = el.parentElement;
                }
                return null;
            }
    
            function hideToolbar() {
                const toolbar = findToolbarContainer();
                if (toolbar) {
                    toolbar.style.setProperty('visibility', 'hidden', 'important');
                    toolbar.style.setProperty('pointer-events', 'none', 'important');
                    toolbar.style.setProperty('height', '0px', 'important');
                    return true;
                }
                return false;
            }
    
            if (!hideToolbar()) {
                const observer = new MutationObserver(function () {
                    if (hideToolbar()) {
                        observer.disconnect();
                    }
                });
                observer.observe(document.body, { childList: true, subtree: true });
        
                // Safety valve: stop watching after 15s so this doesn't run forever
                // if the toolbar never appears (e.g. layout changes upstream).
                setTimeout(function () { observer.disconnect(); }, 15000);
            }
        })();
        true;
    `;

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
                                <Text className="text-sm text-black font-medium">{doctor_name}</Text>
                                <Text className="text-xs text-black-400 mt-1">
                                    {/* 25:12 remaining (30 mins visit) */}
                                    {formatTime(callDuration)}
                                </Text>
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
                         style={{ flex: 1 }}
                    >
                        <WherebyEmbed
                            ref={wherebyRoomRef}
                            room={ROOM_URL ?? ""}
                            style={{ flex: 1 }}
                            injectedJavaScript={HIDE_TOOLBAR_CSS}
                            skipMediaPermissionPrompt
                            onWherebyMessage={(event) => {
                                // console.log(event);
                            }}
                            onReady={() => {
                                // console.log("ready");
                            }}
                            onJoin={() => {
                                setIsJoined(true);

                                callStartTimeRef.current = Date.now();

                                timerRef.current = setInterval(() => {
                                    if (callStartTimeRef.current) {
                                        const seconds = Math.floor(
                                            (Date.now() - callStartTimeRef.current) / 1000
                                        );
                                        setCallDuration(seconds);
                                    }
                                }, 1000);
                            }}
                            onLeave={({ removed }) => {
                                setIsJoined(false);

                                if (timerRef.current) {
                                    clearInterval(timerRef.current);
                                    timerRef.current = null;
                                }

                                const totalCallTime = callDuration; // seconds
                                console.log("Call Duration:", totalCallTime, "seconds");

                                if (!appointment_id) {
                                    return;
                                }
                                router.push({
                                    pathname: "/patient/past-appointment-details/[id]",
                                    params: {
                                        visible: "true",
                                        id: appointment_id,
                                    },
                                });
                            }}
                            onMicrophoneToggle={({ enabled }) => setIsMicrophoneOn(enabled)}
                            onCameraToggle={({ enabled }) => setIsCameraOn(enabled)}
                            onChatToggle={({ open }) => setIsChatOpen(open)}
                            onTranscriptionStatusChange={({ status }) => setIsTranscriptionOn(status === "started")}
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

                {/* Prescription Bottom Sheet */}
                {isPrescriptionOpen && appointment_id && (
                    <BottomSheet
                        ref={addPrescriptionBottomSheetRef}
                        index={1}
                        snapPoints={["80%"]}
                        enablePanDownToClose={true}
                        onChange={handlePrescriptionSheetChange}
                        backgroundStyle={{ backgroundColor: "#fff" }}
                        handleIndicatorStyle={{ width: 0, height: 0 }}
                    >
                        <BottomSheetView style={{ flex: 1 }}>
                            {/* Header */}
                            <View className='flex-row items-center justify-between p-5 pt-0 bg-white border-b border-gray-200'>
                                <Text className='text-lg font-medium text-black'>Prescription</Text>
                                <TouchableOpacity onPress={() => setIsPrescriptionOpen(false)}>
                                    <X color="#1F1E1E" size={18} strokeWidth={2.5} />
                                </TouchableOpacity>
                            </View>
                            <DcotorPrescriptions AppointmentID={appointment_id} />
                        </BottomSheetView>
                    </BottomSheet>
                )}

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