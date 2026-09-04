import {
    BrowserRouter,
    Navigate,
    Route,
    Routes,
} from "react-router-dom";


// =========================================================
// Authentication
// =========================================================

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";


// =========================================================
// Landing & Legal
// =========================================================

import Landing from "../pages/Landing";
import PrivacyPolicy from "../pages/PrivacyPolicy";
import TermsOfUse from "../pages/TermsOfUse";
import Security from "../pages/Security";


// =========================================================
// Student Pages
// =========================================================

// Explore
import Explore from "../pages/student/Explore/Explore";

// Programs
import Programs from "../pages/student/Programs/Programs";
import ProgramDetails from "../pages/student/Programs/ProgramDetails";

// Opportunities
import Opportunities from "../pages/student/Opportunities/Opportunities";
import OpportunityDetails from "../pages/student/Opportunities/OpportunityDetails";

// Universities
import StudentUniversities from "../pages/student/Universities/Universities";
import UniversityDetails from "../pages/student/Universities/UniversityDetails";

// Scholarships
import Scholarships from "../pages/student/Scholarships/Scholarships";

// AI Advisor
import AIAdvisor from "../pages/student/AIAdvisor/AIAdvisor";

// Compare
import Compare from "../pages/student/Compare/Compare";

// Saved
import Saved from "../pages/student/Saved/Saved";

// Applications
import Applications from "../pages/student/Applications/Applications";
import ApplicationDetails from "../pages/student/Applications/ApplicationDetails";

// Profile
import Profile from "../pages/student/Profile/Profile";


// =========================================================
// Student Layout
// =========================================================

import StudentLayout from "../components/student/StudentLayout";


// =========================================================
// Admin Pages
// =========================================================

import AdminDashboard from "../pages/admin/Dashboard";
import AdminOpportunities from "../pages/admin/Opportunities";
import OpportunityCreate from "../pages/admin/OpportunityCreate";
import AdminOpportunityDetails from "../pages/admin/OpportunityDetails";
import OpportunityEdit from "../pages/admin/OpportunityEdit";

import AdminApplications from "../pages/admin/Applications";
import AdminApplicationDetails from "../pages/admin/ApplicationDetails";

import AdminUniversities from "../pages/admin/Universities";
import Countries from "../pages/admin/Countries";


// =========================================================
// Admin Layout
// =========================================================

import AdminLayout from "../components/layout/admin/AdminLayout";


// =========================================================
// Protected Route
// =========================================================

import ProtectedRoute from "./ProtectedRoute";


function AppRoutes() {

    return (

        <BrowserRouter>

            <Routes>


                {/* =================================================
                    Landing
                ================================================= */}

                <Route
                    path="/"
                    element={<Landing />}
                />


                {/* =================================================
                    Legal
                ================================================= */}

                <Route
                    path="/privacy-policy"
                    element={<PrivacyPolicy />}
                />

                <Route
                    path="/terms-of-use"
                    element={<TermsOfUse />}
                />

                <Route
                    path="/security"
                    element={<Security />}
                />


                {/* =================================================
                    Authentication
                ================================================= */}

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />


                {/* =================================================
                    Student Platform
                ================================================= */}

                <Route
                    element={
                        <ProtectedRoute role="student">
                            <StudentLayout />
                        </ProtectedRoute>
                    }
                >


                    {/* =================================================
                        Student Home
                    ================================================= */}

                    <Route
                        path="/student"
                        element={
                            <Navigate
                                to="/student/explore"
                                replace
                            />
                        }
                    />


                    {/* =================================================
                        Explore
                    ================================================= */}

                    <Route
                        path="/student/explore"
                        element={<Explore />}
                    />


                    {/* =================================================
                        Programs
                    ================================================= */}

                    <Route
                        path="/student/programs"
                        element={<Programs />}
                    />

                    <Route
                        path="/student/programs/:id"
                        element={<ProgramDetails />}
                    />


                    {/* =================================================
                        Opportunities
                    ================================================= */}

                    <Route
                        path="/student/opportunities"
                        element={<Opportunities />}
                    />

                    <Route
                        path="/student/opportunities/:id"
                        element={<OpportunityDetails />}
                    />


                    {/* =================================================
                        Universities
                    ================================================= */}

                    <Route
                        path="/student/universities"
                        element={<StudentUniversities />}
                    />

                    <Route
                        path="/student/universities/:id"
                        element={<UniversityDetails />}
                    />


                    {/* =================================================
                        Scholarships
                    ================================================= */}

                    <Route
                        path="/student/scholarships"
                        element={<Scholarships />}
                    />


                    {/* =================================================
                        AI Advisor
                    ================================================= */}

                    <Route
                        path="/student/ai-advisor"
                        element={<AIAdvisor />}
                    />


                    {/* =================================================
                        Compare
                    ================================================= */}

                    <Route
                        path="/student/compare"
                        element={<Compare />}
                    />


                    {/* =================================================
                        Saved
                    ================================================= */}

                    <Route
                        path="/student/saved"
                        element={<Saved />}
                    />


                    {/* =================================================
                        Applications
                    ================================================= */}

                    <Route
                        path="/student/applications"
                        element={<Applications />}
                    />

                    <Route
                        path="/student/applications/:id"
                        element={<ApplicationDetails />}
                    />


                    {/* =================================================
                        Profile
                    ================================================= */}

                    <Route
                        path="/student/profile"
                        element={<Profile />}
                    />

                </Route>


                {/* =================================================
                    Admin Platform
                ================================================= */}

                <Route
                    element={
                        <ProtectedRoute role="admin">
                            <AdminLayout />
                        </ProtectedRoute>
                    }
                >


                    {/* Dashboard */}

                    <Route
                        path="/admin"
                        element={<AdminDashboard />}
                    />


                    {/* Opportunities */}

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


                    {/* Applications */}

                    <Route
                        path="/admin/applications"
                        element={<AdminApplications />}
                    />

                    <Route
                        path="/admin/applications/:id"
                        element={<AdminApplicationDetails />}
                    />


                    {/* Universities */}

                    <Route
                        path="/admin/universities"
                        element={<AdminUniversities />}
                    />


                    {/* Countries */}

                    <Route
                        path="/admin/countries"
                        element={<Countries />}
                    />

                </Route>


                {/* =================================================
                    Unknown Routes
                ================================================= */}

                <Route
                    path="*"
                    element={
                        <Navigate
                            to="/"
                            replace
                        />
                    }
                />

            </Routes>

        </BrowserRouter>
    );
}


export default AppRoutes;
