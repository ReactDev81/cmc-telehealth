import * as React from "react";
import { View, Alert, Platform } from "react-native";
import { Camera } from "expo-camera";
import { WherebyEmbed, type WherebyWebView } from "@whereby.com/react-native-sdk/embed";

const ROOM_URL = process.env.EXPO_PUBLIC_PATIENT_CALL_LINK;

const WhereBy = () => {
  
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

    if (Platform.OS === "android" && !hasPermissionForAndroid) {
        return <View />;
    }
  
    return(
        <View style={{ flex: 1 }}>
            <View style={{ flex: 1, height: "100%" }}>
                <WherebyEmbed
                    ref={wherebyRoomRef}
                    style={{ flex: 1 }}
                    room={ROOM_URL}
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