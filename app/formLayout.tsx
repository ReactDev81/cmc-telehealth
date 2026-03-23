import React from "react";
import { StyleProp, ViewStyle } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { SafeAreaView } from "react-native-safe-area-context";

type FormLayoutProps = {
    children: React.ReactNode;
    contentContainerStyle?: StyleProp<ViewStyle>;
    style?: StyleProp<ViewStyle>;
    transparent?: boolean;
};

export default function FormLayout({
    children,
    contentContainerStyle,
    style,
    transparent = false,
}: FormLayoutProps) {
    return (
        <SafeAreaView
            className="flex-1"
            // edges={transparent ? [] : ["left", "right", "bottom"]}
            style={[{ flex: 1 }, !transparent && { backgroundColor: "white" }, style]}
        >
            <KeyboardAwareScrollView
                bottomOffset={20}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={[
                    { flexGrow: 1, justifyContent: "center" },
                    contentContainerStyle,
                ]}
                className={transparent ? undefined : "px-4"}
            >
                {children}
            </KeyboardAwareScrollView>
        </SafeAreaView>
    );
}