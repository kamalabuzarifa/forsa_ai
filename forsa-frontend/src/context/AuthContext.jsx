import {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    getMe,
    logout as logoutRequest,
} from "../api/auth";

const AuthContext = createContext(null);

function getStoredUser() {
    try {
        const storedUser = localStorage.getItem("user");

        if (!storedUser) {
            return null;
        }

        return JSON.parse(storedUser);
    } catch (error) {
        console.error(
            "Failed to parse stored user:",
            error
        );

        localStorage.removeItem("user");

        return null;
    }
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(getStoredUser);
    const [loading, setLoading] = useState(true);

    const isAuthenticated = useMemo(() => {
        const token = localStorage.getItem("token");

        return Boolean(token && user);
    }, [user]);

    useEffect(() => {
        const verifyUser = async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                setUser(null);
                setLoading(false);
                return;
            }

            try {
                const response = await getMe();

                const currentUser =
                    response?.data?.user ??
                    response?.user ??
                    null;

                if (!currentUser) {
                    throw new Error(
                        "Authenticated user was not returned by the API."
                    );
                }

                setUser(currentUser);

                localStorage.setItem(
                    "user",
                    JSON.stringify(currentUser)
                );
            } catch (error) {
                console.error(
                    "Authentication verification failed:",
                    error
                );

                localStorage.removeItem("token");
                localStorage.removeItem("user");

                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        verifyUser();
    }, []);

    const handleLogin = (loginData) => {
        const token = loginData?.token;
        const loginUser = loginData?.user;

        if (!token || !loginUser) {
            console.error(
                "Login failed: token or user is missing."
            );

            return;
        }

        localStorage.setItem(
            "token",
            token
        );

        localStorage.setItem(
            "user",
            JSON.stringify(loginUser)
        );

        setUser(loginUser);
    };

    const handleLogout = async () => {
        try {
            await logoutRequest();
        } catch (error) {
            console.error(
                "Logout request failed:",
                error
            );
        } finally {
            localStorage.removeItem("token");
            localStorage.removeItem("user");

            setUser(null);
        }
    };

    const value = {
        user,
        setUser,
        loading,
        isAuthenticated,
        login: handleLogin,
        logout: handleLogout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error(
            "useAuth must be used inside AuthProvider"
        );
    }

    return context;
}
