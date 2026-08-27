import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children, role }) {
    const {
        loading,
        isAuthenticated,
        user,
    } = useAuth();

    const location = useLocation();

    if (loading) {
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
                state={{ from: location }}
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

    return children;
}

export default ProtectedRoute;
