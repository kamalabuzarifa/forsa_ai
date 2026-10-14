import {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    getMe,
    login as loginRequest,
    register as registerRequest,
    logout as logoutRequest,
} from "../api/auth";


const AuthContext = createContext(null);


/*
|--------------------------------------------------------------------------
| Stored User
|--------------------------------------------------------------------------
*/

function getStoredUser() {
    try {
        const storedUser =
            localStorage.getItem("user");

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


/*
|--------------------------------------------------------------------------
| Auth Provider
|--------------------------------------------------------------------------
*/

export function AuthProvider({ children }) {

    const [user, setUser] = useState(
        getStoredUser
    );

    const [loading, setLoading] =
        useState(true);


    /*
    |--------------------------------------------------------------------------
    | Authentication
    |--------------------------------------------------------------------------
    */

    const isAuthenticated = useMemo(() => {

        const token =
            localStorage.getItem("token");

        return Boolean(
            token && user
        );

    }, [user]);


    /*
    |--------------------------------------------------------------------------
    | Roles
    |--------------------------------------------------------------------------
    */

    const isStudent =
        user?.role === "student";

    const isAdmin =
        user?.role === "admin" ||
        user?.role === "super_admin";


    /*
    |--------------------------------------------------------------------------
    | Verify User
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        const verifyUser = async () => {

            const token =
                localStorage.getItem("token");

            if (!token) {

                setUser(null);
                setLoading(false);

                return;
            }

            try {

                const response =
                    await getMe();

                const currentUser =
                    response?.data?.user ??
                    response?.user ??
                    response?.data ??
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

                localStorage.removeItem(
                    "token"
                );

                localStorage.removeItem(
                    "user"
                );

                setUser(null);

            } finally {

                setLoading(false);

            }
        };


        verifyUser();

    }, []);


    /*
    |--------------------------------------------------------------------------
    | Login
    |--------------------------------------------------------------------------
    */

    const handleLogin = async (
        email,
        password
    ) => {

        const response =
            await loginRequest(
                email,
                password
            );


        /*
        | Laravel response can be:
        |
        | {
        |     token: "...",
        |     user: {...}
        | }
        |
        | or:
        |
        | {
        |     data: {
        |         token: "...",
        |         user: {...}
        |     }
        | }
        */

        const data =
            response?.data &&
                typeof response.data === "object"
                ? response.data
                : response;


        const token =
            data?.token;


        const loginUser =
            data?.user;


        if (!token) {

            throw new Error(
                "Login response does not contain a token."
            );
        }


        if (!loginUser) {

            throw new Error(
                "Login response does not contain user data."
            );
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


        return loginUser;
    };


    /*
    |--------------------------------------------------------------------------
    | Register
    |--------------------------------------------------------------------------
    */

    const handleRegister = async (
        name,
        email,
        password,
        passwordConfirmation
    ) => {

        const response =
            await registerRequest(
                name,
                email,
                password,
                passwordConfirmation
            );

        return response;
    };


    /*
    |--------------------------------------------------------------------------
    | Logout
    |--------------------------------------------------------------------------
    */

    const handleLogout = async () => {

        try {

            const token =
                localStorage.getItem("token");

            if (token) {

                await logoutRequest();

            }

        } catch (error) {

            console.error(
                "Logout request failed:",
                error
            );

        } finally {

            localStorage.removeItem(
                "token"
            );

            localStorage.removeItem(
                "user"
            );

            setUser(null);
        }
    };


    /*
    |--------------------------------------------------------------------------
    | Context
    |--------------------------------------------------------------------------
    */

    const value = {

        user,
        setUser,

        loading,

        isAuthenticated,

        isStudent,
        isAdmin,

        login: handleLogin,
        register: handleRegister,
        logout: handleLogout,
    };


    return (
        <AuthContext.Provider
            value={value}
        >
            {children}
        </AuthContext.Provider>
    );
}


/*
|--------------------------------------------------------------------------
| useAuth
|--------------------------------------------------------------------------
*/

export function useAuth() {

    const context =
        useContext(AuthContext);

    if (!context) {

        throw new Error(
            "useAuth must be used inside AuthProvider"
        );
    }

    return context;
}
