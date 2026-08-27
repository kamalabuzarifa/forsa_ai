import {
    BrowserRouter,
    Navigate,
    Route,
    Routes,
} from "react-router-dom";

import Login from "../pages/auth/Login";

import Dashboard from "../pages/student/Dashboard";
import Opportunities from "../pages/student/Opportunities";
import OpportunityDetails from "../pages/student/OpportunityDetails";
import Applications from "../pages/student/Applications";
import ApplicationDetails from "../pages/student/ApplicationDetails";

import AdminDashboard from "../pages/admin/Dashboard";
import AdminOpportunities from "../pages/admin/Opportunities";
import AdminApplications from "../pages/admin/Applications";
import OpportunityCreate from "../pages/admin/OpportunityCreate";
import AdminOpportunityDetails from "../pages/admin/OpportunityDetails";
import OpportunityEdit from "../pages/admin/OpportunityEdit";
import AdminApplicationDetails from "../pages/admin/ApplicationDetails";
import Universities from "../pages/admin/Universities";
import Countries from "../pages/admin/Countries";

import AdminLayout from "../components/layout/admin/AdminLayout";

import ProtectedRoute from "./ProtectedRoute";

function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>

                <Route
                    path="/"
                    element={
                        <Navigate
                            to="/student"
                            replace
                        />
                    }
                />

                <Route
                    path="/login"
                    element={<Login />}
                />

                {/* Student Routes */}

                <Route
                    path="/student"
                    element={
                        <ProtectedRoute role="student">
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/student/opportunities"
                    element={
                        <ProtectedRoute role="student">
                            <Opportunities />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/student/opportunities/:id"
                    element={
                        <ProtectedRoute role="student">
                            <OpportunityDetails />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/student/applications"
                    element={
                        <ProtectedRoute role="student">
                            <Applications />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/student/applications/:id"
                    element={
                        <ProtectedRoute role="student">
                            <ApplicationDetails />
                        </ProtectedRoute>
                    }
                />

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
                        element={
                            <AdminApplicationDetails />
                        }
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
