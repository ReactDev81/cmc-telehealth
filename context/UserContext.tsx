import { User } from "@/types/common/user-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useState } from "react";

interface UserContextType {
    user: User | null;
    initializing: boolean;
    login: (user: User) => Promise<void>;
    logout: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const STORAGE_KEY = "@user";

export function UserProvider({ children }: { children: React.ReactNode }) {

    const [user, setUser] = useState<User | null>(null);
    const [initializing, setInitializing] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const stored = await AsyncStorage.getItem(STORAGE_KEY);
                if (stored) {
                    setUser(JSON.parse(stored));
                }
            } catch (e) {
                console.log("Error loading user from storage", e);
            } finally {
                setInitializing(false);
            }
        })();
    }, []);

    const login = async (userData: User) => {
        setUser(userData);
        try {
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
        } catch (e) {
            console.log("Error saving user to storage", e);
        }
    };

    const logout = async () => {
        setUser(null);
        try {
            await AsyncStorage.removeItem(STORAGE_KEY);
        } catch (e) {
            console.log("Error removing user from storage", e);
        }
    };

    return (
        <UserContext.Provider value={{ user, initializing, login, logout }}>
            {children}
        </UserContext.Provider>
    );
}

export const useAuth = () => {              
    const context = useContext(UserContext);
    if (!context) throw new Error("useAuth must be used within a UserProvider");
    return context;
};