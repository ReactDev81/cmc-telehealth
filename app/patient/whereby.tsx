import * as React from "react";
import { View, Alert, Platform } from "react-native";
import { Camera } from "expo-camera";
import { WherebyEmbed, type WherebyWebView } from "@whereby.com/react-native-sdk/embed";

const WhereBy = () => {
    const roomUrl = process.env.EXPO_PUBLIC_PATIENT_CALL_LINK;
  
    React.useEffect(() => {
        if (!roomUrl) {
            console.error("Missing EXPO_PUBLIC_PATIENT_CALL_LINK environment variable.");
            Alert.alert("Configuration Error", "Unable to join the call because the room link is missing.");
        }
    }, [roomUrl]);
  
    const wherebyRoomRef = React.useRef<WherebyWebView>(null);
    const [hasPermissionForAndroid, setHasPermissionForAndroid] = React.useState<boolean>(false);

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

    if (!roomUrl) {
        return <View />;
    }

    if (Platform.OS === "android" && !hasPermissionForAndroid) {
        return <View />;
    }
  
    return(
        <View style={{ flex: 1 }}>
            <View style={{ flex: 1, height: "100%" }}>
                <WherebyEmbed
                    ref={wherebyRoomRef}
                    style={{ flex: 1 }}
                    room={roomUrl}
                    // Skips the media permission prompt.
                    skipMediaPermissionPrompt
                    // Catch-all for any Whereby event
                    onWherebyMessage={(event) => {
                        console.log(event);
                    }}
                    // Specific callbacks for each Whereby event
                    onReady={() => {
                        console.log("ready");
                    }}
                />
            </View>
        </View>
    )
}

export default WhereBy