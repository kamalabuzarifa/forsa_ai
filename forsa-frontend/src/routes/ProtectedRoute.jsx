import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { getStudentProfile } from "../api/profile";

function ProtectedRoute({ children, role }) {
    const {
        loading,
        isAuthenticated,
        user,
    } = useAuth();

    const location = useLocation();

    const [profileLoading, setProfileLoading] = useState(false);
    const [profileComplete, setProfileComplete] = useState(true);

    useEffect(() => {
        const checkProfileCompletion = async () => {
            if (
                !isAuthenticated ||
                !user ||
                user.role !== "student" ||
                role !== "student"
            ) {
                setProfileLoading(false);
                return;
            }

            // Profile page must always be accessible
            if (location.pathname === "/student/profile") {
                setProfileLoading(false);
                return;
            }

            try {
                setProfileLoading(true);

                const response = await getStudentProfile();

                const completion =
                    Number(
                        response?.profile?.profile_completion
                    ) || 0;

                setProfileComplete(completion >= 100);
            } catch (error) {
                console.error(
                    "Failed to check profile completion:",
                    error
                );

                setProfileComplete(false);
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

    if (loading || profileLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background">
                <div className="flex flex-col items-center gap-3">
                    <div className="size-8 animate-spin rounded-full border-2 border-muted border-t-primary" />

                    <p className="text-sm text-muted-foreground">
                        Loading...
                    </p>
                </div>
            </div>
        );
    }

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

    if (role && user?.role !== role) {
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
        location.pathname !== "/student/profile" &&
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

    return children;
}

export default ProtectedRoute;
