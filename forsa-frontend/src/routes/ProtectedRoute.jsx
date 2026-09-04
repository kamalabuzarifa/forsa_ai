import {
    useEffect,
    useState,
} from "react";

import {
    Navigate,
    useLocation,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";

import {
    getStudentProfile,
} from "../api/profile";


function ProtectedRoute({
    children,
    role,
}) {

    const {
        loading,
        isAuthenticated,
        user,
    } = useAuth();

    const location =
        useLocation();

    const [
        profileLoading,
        setProfileLoading,
    ] = useState(false);

    const [
        profileComplete,
        setProfileComplete,
    ] = useState(true);


    /*
    |--------------------------------------------------------------------------
    | Check Student Profile
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        const checkProfileCompletion =
            async () => {

                if (
                    !isAuthenticated ||
                    !user ||
                    role !== "student" ||
                    user.role !== "student"
                ) {
                    return;
                }


                /*
                |------------------------------------------------------------------
                | Profile Page
                |------------------------------------------------------------------
                |
                | The student must always be able to access the profile page.
                |
                */

                if (
                    location.pathname ===
                    "/student/profile"
                ) {
                    setProfileComplete(true);
                    return;
                }


                try {

                    setProfileLoading(true);

                    const response =
                        await getStudentProfile();

                    const completion =
                        Number(
                            response?.profile
                                ?.profile_completion
                        ) || 0;

                    setProfileComplete(
                        completion >= 100
                    );

                } catch (error) {

                    console.error(
                        "Failed to check profile completion:",
                        error
                    );

                    /*
                    |--------------------------------------------------------------
                    | If the profile cannot be loaded, don't block the user.
                    |--------------------------------------------------------------
                    */

                    setProfileComplete(true);

                } finally {

                    setProfileLoading(false);

                }
            };

        checkProfileCompletion();

    }, [
        isAuthenticated,
        user,
        role,
        location.pathname,
    ]);


    /*
    |--------------------------------------------------------------------------
    | Loading
    |--------------------------------------------------------------------------
    */

    if (
        loading ||
        profileLoading
    ) {

        return (
            <div className="route-loading">

                <div className="route-loading-spinner" />

                <p>
                    Loading...
                </p>

            </div>
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Authentication
    |--------------------------------------------------------------------------
    */

    if (!isAuthenticated) {

        return (
            <Navigate
                to="/login"
                replace
                state={{
                    from: location,
                }}
            />
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Role Protection
    |--------------------------------------------------------------------------
    */

    if (
        role &&
        user?.role !== role
    ) {

        const fallbackPath =
            user?.role === "admin"
                ? "/admin"
                : "/student";

        return (
            <Navigate
                to={fallbackPath}
                replace
            />
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Student Profile Completion
    |--------------------------------------------------------------------------
    */

    if (
        role === "student" &&
        user?.role === "student" &&
        location.pathname !==
        "/student/profile" &&
        !profileComplete
    ) {

        return (
            <Navigate
                to="/student/profile"
                replace
                state={{
                    profileRequired: true,
                    from: location.pathname,
                }}
            />
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Access Granted
    |--------------------------------------------------------------------------
    */

    return children;
}


export default ProtectedRoute;
