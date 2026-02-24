import { useAuth } from "@/context/UserContext";
import { Redirect } from "expo-router";
import { ActivityIndicator, View } from "react-native";

export default function Index() {

    const { user, initializing } = useAuth();

    console.log("user", user);

    if (initializing) {
        return (
            <View className="flex-1 justify-center items-center bg-white">
                <ActivityIndicator />
            </View>
        );
    }

    // Not logged in → go to splash (or login)
    if (!user) {
        return <Redirect href="/splash" />;
    }

    // Logged in → go to role-based home
    // if (user.role === "patient") {
    //     return <Redirect href="/(patient)" />;
    // }

    // if (user.role === "doctor") {
    //     return <Redirect href="/(doctor)" />; 
    // }

    if (user && user?.role === "patient" && user?.status === "verified") {
        return(
            <Redirect
                href={{
                    pathname: "/auth/register-complete-profile",
                    params: { email: user.email },
                }}
            />
        )
    }

    if (user && user?.role === "patient" && user?.status === "registered") {
        return <Redirect href="/(patient)" />;
    }

    if (user && user?.role === "doctor") {
        return <Redirect href="/(doctor)" />
    }

    return <Redirect href="/splash" />;
}