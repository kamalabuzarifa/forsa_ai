import {
    Search,
    Heart,
    GitCompare,
    GraduationCap,
    Sparkles,
    Menu,
    X,
    User,
    LogOut,
    ChevronDown,
    Building2,
    Award,
    FileText,
} from "lucide-react";

import {
    Link,
    NavLink,
    useNavigate,
} from "react-router-dom";

import { useState } from "react";

import "./StudentNavbar.css";


function StudentNavbar() {

    const navigate = useNavigate();

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const [profileOpen, setProfileOpen] = useState(false);


    const closeMobileMenu = () => {
        setMobileMenuOpen(false);
    };


    const handleLogout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login", {
            replace: true,
        });
    };


    const navLinkClass = ({ isActive }) =>
        `student-nav-link ${isActive ? "active" : ""}`;


    return (
        <header className="student-navbar">

            <div className="student-navbar-inner">


                {/* =================================================
                    Logo
                ================================================= */}

                <Link
                    to="/student/explore"
                    className="student-logo"
                    onClick={closeMobileMenu}
                >

                    <span className="student-logo-mark">
                        <GraduationCap size={19} />
                    </span>

                    <span className="student-logo-text">
                        EduMatch
                    </span>

                </Link>


                {/* =================================================
                    Desktop Navigation
                ================================================= */}

                <nav className="student-nav">

                    <NavLink
                        to="/student/explore"
                        className={navLinkClass}
                    >
                        Explore
                    </NavLink>


                    <NavLink
                        to="/student/programs"
                        className={navLinkClass}
                    >
                        Programs
                    </NavLink>


                    <NavLink
                        to="/student/universities"
                        className={navLinkClass}
                    >
                        Universities
                    </NavLink>


                    <NavLink
                        to="/student/scholarships"
                        className={navLinkClass}
                    >
                        Scholarships
                    </NavLink>


                    <NavLink
                        to="/student/ai-advisor"
                        className={`${navLinkClass} ai-nav-link`}
                    >

                        <Sparkles size={14} />

                        AI Advisor

                    </NavLink>

                </nav>


                {/* =================================================
                    Right Actions
                ================================================= */}

                <div className="student-navbar-actions">


                    {/* Search */}

                    <button
                        type="button"
                        className="navbar-icon-button"
                        title="Search"
                        onClick={() =>
                            navigate("/student/programs")
                        }
                    >
                        <Search size={17} />
                    </button>


                    {/* Saved */}

                    <button
                        type="button"
                        className="navbar-icon-button"
                        title="Saved"
                        onClick={() =>
                            navigate("/student/saved")
                        }
                    >
                        <Heart size={17} />
                    </button>


                    {/* Compare */}

                    <button
                        type="button"
                        className="navbar-icon-button"
                        title="Compare"
                        onClick={() =>
                            navigate("/student/compare")
                        }
                    >
                        <GitCompare size={17} />
                    </button>


                    {/* Divider */}

                    <span className="navbar-divider" />


                    {/* Profile */}

                    <div className="student-profile-wrapper">

                        <button
                            type="button"
                            className="student-profile-button"
                            onClick={() =>
                                setProfileOpen(!profileOpen)
                            }
                        >

                            <span className="student-avatar">
                                <User size={16} />
                            </span>

                            <span className="student-profile-name">
                                My Profile
                            </span>

                            <ChevronDown
                                size={14}
                                className={
                                    profileOpen
                                        ? "profile-chevron rotated"
                                        : "profile-chevron"
                                }
                            />

                        </button>


                        {profileOpen && (

                            <div className="student-profile-menu">

                                <Link
                                    to="/student/profile"
                                    onClick={() =>
                                        setProfileOpen(false)
                                    }
                                >
                                    <User size={15} />
                                    Profile
                                </Link>


                                <Link
                                    to="/student/saved"
                                    onClick={() =>
                                        setProfileOpen(false)
                                    }
                                >
                                    <Heart size={15} />
                                    Saved Programs
                                </Link>


                                <Link
                                    to="/student/applications"
                                    onClick={() =>
                                        setProfileOpen(false)
                                    }
                                >
                                    <FileText size={15} />
                                    My Applications
                                </Link>


                                <div className="profile-menu-divider" />


                                <button
                                    type="button"
                                    onClick={handleLogout}
                                    className="profile-logout"
                                >
                                    <LogOut size={15} />
                                    Logout
                                </button>

                            </div>

                        )}

                    </div>


                    {/* Mobile Button */}

                    <button
                        type="button"
                        className="mobile-menu-button"
                        onClick={() =>
                            setMobileMenuOpen(!mobileMenuOpen)
                        }
                    >

                        {mobileMenuOpen
                            ? <X size={21} />
                            : <Menu size={21} />
                        }

                    </button>

                </div>

            </div>


            {/* =====================================================
                Mobile Navigation
            ===================================================== */}

            {mobileMenuOpen && (

                <div className="student-mobile-menu">

                    <NavLink
                        to="/student/explore"
                        className={navLinkClass}
                        onClick={closeMobileMenu}
                    >
                        <Search size={16} />
                        Explore
                    </NavLink>


                    <NavLink
                        to="/student/programs"
                        className={navLinkClass}
                        onClick={closeMobileMenu}
                    >
                        <GraduationCap size={16} />
                        Programs
                    </NavLink>


                    <NavLink
                        to="/student/universities"
                        className={navLinkClass}
                        onClick={closeMobileMenu}
                    >
                        <Building2 size={16} />
                        Universities
                    </NavLink>


                    <NavLink
                        to="/student/scholarships"
                        className={navLinkClass}
                        onClick={closeMobileMenu}
                    >
                        <Award size={16} />
                        Scholarships
                    </NavLink>


                    <NavLink
                        to="/student/ai-advisor"
                        className={navLinkClass}
                        onClick={closeMobileMenu}
                    >
                        <Sparkles size={16} />
                        AI Advisor
                    </NavLink>


                    <NavLink
                        to="/student/compare"
                        className={navLinkClass}
                        onClick={closeMobileMenu}
                    >
                        <GitCompare size={16} />
                        Compare
                    </NavLink>


                    <NavLink
                        to="/student/saved"
                        className={navLinkClass}
                        onClick={closeMobileMenu}
                    >
                        <Heart size={16} />
                        Saved
                    </NavLink>


                    <NavLink
                        to="/student/applications"
                        className={navLinkClass}
                        onClick={closeMobileMenu}
                    >
                        <FileText size={16} />
                        Applications
                    </NavLink>


                    <NavLink
                        to="/student/profile"
                        className={navLinkClass}
                        onClick={closeMobileMenu}
                    >
                        <User size={16} />
                        Profile
                    </NavLink>


                    <button
                        type="button"
                        className="mobile-logout"
                        onClick={handleLogout}
                    >
                        <LogOut size={16} />
                        Logout
                    </button>

                </div>

            )}

        </header>
    );
}

export default StudentNavbar;
