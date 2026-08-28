import {
    BrowserRouter,
    Navigate,
    Route,
    Routes,
} from "react-router-dom";

import Login from "../pages/auth/Login";

// Student Pages
import Dashboard from "../pages/student/Dashboard";
import Opportunities from "../pages/student/Opportunities";
import OpportunityDetails from "../pages/student/OpportunityDetails";
import Applications from "../pages/student/Applications";
import ApplicationDetails from "../pages/student/ApplicationDetails";
import Profile from "../pages/student/profile";
import Recommended from "../pages/student/Recommended";

// Admin Pages
import AdminDashboard from "../pages/admin/Dashboard";
import AdminOpportunities from "../pages/admin/Opportunities";
import AdminApplications from "../pages/admin/Applications";
import OpportunityCreate from "../pages/admin/OpportunityCreate";
import AdminOpportunityDetails from "../pages/admin/OpportunityDetails";
import OpportunityEdit from "../pages/admin/OpportunityEdit";
import AdminApplicationDetails from "../pages/admin/ApplicationDetails";
import Universities from "../pages/admin/Universities";
import Countries from "../pages/admin/Countries";

// Layouts
import AdminLayout from "../components/layout/admin/AdminLayout";
import StudentLayout from "../components/layout/student/StudentLayout";

import ProtectedRoute from "./ProtectedRoute";

function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>

                {/* Root */}

                <Route
                    path="/"
                    element={
                        <Navigate
                            to="/student"
                            replace
                        />
                    }
                />

                {/* Authentication */}

                <Route
                    path="/login"
                    element={<Login />}
                />

                {/* Student Routes */}

                <Route
                    element={
                        <ProtectedRoute role="student">
                            <StudentLayout />
                        </ProtectedRoute>
                    }
                >
                    <Route
                        path="/student"
                        element={<Dashboard />}
                    />
                    <Route
                        path="/student/profile"
                        element={<Profile />}
                    />
                    <Route
                        path="/student/opportunities"
                        element={<Opportunities />}
                    />

                    <Route
                        path="/student/opportunities/:id"
                        element={<OpportunityDetails />}
                    />

                    <Route
                        path="/student/applications"
                        element={<Applications />}
                    />

                    <Route
                        path="/student/recommended"
                        element={<Recommended />}
                    />
                    
                    <Route
                        path="/student/applications/:id"
                        element={<ApplicationDetails />}
                    />
                </Route>

                {/* Admin Routes */}

                <Route
                    element={
                        <ProtectedRoute role="admin">
                            <AdminLayout />
                        </ProtectedRoute>
                    }
                >
                    <Route
                        path="/admin"
                        element={<AdminDashboard />}
                    />

                    <Route
                        path="/admin/opportunities"
                        element={<AdminOpportunities />}
                    />

                    <Route
                        path="/admin/opportunities/create"
                        element={<OpportunityCreate />}
                    />

                    <Route
                        path="/admin/opportunities/:id"
                        element={<AdminOpportunityDetails />}
                    />

                    <Route
                        path="/admin/opportunities/:id/edit"
                        element={<OpportunityEdit />}
                    />

                    <Route
                        path="/admin/applications"
                        element={<AdminApplications />}
                    />

                    <Route
                        path="/admin/applications/:id"
                        element={<AdminApplicationDetails />}
                    />

                    <Route
                        path="/admin/universities"
                        element={<Universities />}
                    />

                    <Route
                        path="/admin/countries"
                        element={<Countries />}
                    />
                </Route>

                {/* Unknown Routes */}

                <Route
                    path="*"
                    element={
                        <Navigate
                            to="/student"
                            replace
                        />
                    }
                />

            </Routes>
        </BrowserRouter>
    );
}

export default AppRoutes;
