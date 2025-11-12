import { createContext, useContext, useState } from "react";
import { User } from "@/types/common/user-context";

interface UserContextType {
    user: User | null;
    login: (user: User) => void;
    logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {

    const [user, setUser] = useState<User | null>(null);

    const login = (userData: User) => setUser(userData);
    const logout = () => setUser(null);

    return(
        <UserContext.Provider value={{ user, login, logout }}>
            {children}
        </UserContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(UserContext);
    if (!context) throw new Error("useAuth must be used within a UserProvider");
    return context;
};