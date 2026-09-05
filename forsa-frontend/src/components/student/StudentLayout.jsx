import {
    Bell,
    Bookmark,
    Building2,
    ChevronDown,
    GraduationCap,
    Heart,
    LogOut,
    Menu,
    Scale,
    Search,
    Sparkles,
    User,
    X,
} from "lucide-react";

import {
    Link,
    NavLink,
    Outlet,
    useNavigate,
} from "react-router-dom";

import {
    useEffect,
    useRef,
    useState,
} from "react";

import StudentFooter from "./StudentFooter";

import "./StudentLayout.css";


function StudentLayout() {

    const navigate = useNavigate();

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);

    const profileRef = useRef(null);


    // =========================================================
    // Close profile menu when clicking outside
    // =========================================================

    useEffect(() => {

        function handleClickOutside(event) {

            if (
                profileRef.current &&
                !profileRef.current.contains(event.target)
            ) {
                setProfileOpen(false);
            }

        }

        document.addEventListener(
            "mousedown",
            handleClickOutside
        );

        return () => {

            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );

        };

    }, []);


    // =========================================================
    // Navigation
    // =========================================================

    const navigation = [
        {
            label: "Explore",
            path: "/student/explore",
            icon: Search,
        },
        {
            label: "Programs",
            path: "/student/programs",
            icon: GraduationCap,
        },
        {
            label: "Universities",
            path: "/student/universities",
            icon: Building2,
        },
        {
            label: "Scholarships",
            path: "/student/scholarships",
            icon: Sparkles,
        },
    ];


    const personalNavigation = [
        {
            label: "AI Advisor",
            path: "/student/ai-advisor",
            icon: Sparkles,
        },
        {
            label: "Compare",
            path: "/student/compare",
            icon: Scale,
        },
        {
            label: "Saved",
            path: "/student/saved",
            icon: Bookmark,
        },
        {
            label: "Applications",
            path: "/student/applications",
            icon: GraduationCap,
        },
    ];


    // =========================================================
    // Logout
    // =========================================================

    const handleLogout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");

    };


    // =========================================================
    // Close mobile menu
    // =========================================================

    const handleMobileNavigation = () => {

        setMobileMenuOpen(false);

    };


    return (

        <div className="student-layout">


            {/* =================================================
                Header
            ================================================= */}

            <header className="student-header">

                <div className="student-header-container">


                    {/* =================================================
                        Header Left
                    ================================================= */}

                    <div className="student-header-left">


                        {/* Mobile Menu */}

                        <button
                            type="button"
                            className="student-mobile-menu-button"
                            onClick={() =>
                                setMobileMenuOpen(!mobileMenuOpen)
                            }
                            aria-label="Toggle navigation"
                        >

                            {mobileMenuOpen ? (
                                <X size={20} />
                            ) : (
                                <Menu size={20} />
                            )}

                        </button>


                        {/* Logo */}

                        <Link
                            to="/student/explore"
                            className="student-logo"
                            onClick={handleMobileNavigation}
                        >

                            <span className="student-logo-mark">
                                E
                            </span>

                            <span className="student-logo-text">
                                Edu<span>Match</span>
                            </span>

                        </Link>


                    </div>


                    {/* =================================================
                        Desktop Navigation
                    ================================================= */}

                    <nav className="student-navigation">


                        {navigation.map((item) => {

                            const Icon = item.icon;

                            return (

                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    className={({ isActive }) =>
                                        `student-nav-link ${isActive
                                            ? "active"
                                            : ""
                                        }`
                                    }
                                >

                                    <Icon size={16} />

                                    <span>
                                        {item.label}
                                    </span>

                                </NavLink>

                            );

                        })}


                        {/* AI Advisor */}

                        <NavLink
                            to="/student/ai-advisor"
                            className={({ isActive }) =>
                                `student-ai-nav-link ${isActive
                                    ? "active"
                                    : ""
                                }`
                            }
                        >

                            <Sparkles size={15} />

                            <span>
                                AI Advisor
                            </span>

                        </NavLink>


                    </nav>


                    {/* =================================================
                        Header Right
                    ================================================= */}

                    <div className="student-header-right">


                        {/* Search */}

                        <button
                            type="button"
                            className="student-header-icon"
                            title="Search"
                            onClick={() =>
                                navigate("/student/explore")
                            }
                        >

                            <Search size={18} />

                        </button>


                        {/* Notifications */}

                        <button
                            type="button"
                            className="student-header-icon notification-button"
                            title="Notifications"
                        >

                            <Bell size={18} />

                            <span className="notification-dot" />

                        </button>


                        {/* Profile */}

                        <div
                            className="student-profile-wrapper"
                            ref={profileRef}
                        >

                            <button
                                type="button"
                                className="student-profile-button"
                                onClick={() =>
                                    setProfileOpen(!profileOpen)
                                }
                            >

                                <span className="student-avatar">
                                    K
                                </span>

                                <span className="student-profile-name">
                                    Student
                                </span>

                                <ChevronDown
                                    size={15}
                                    className={
                                        profileOpen
                                            ? "rotate"
                                            : ""
                                    }
                                />

                            </button>


                            {/* Profile Dropdown */}

                            {profileOpen && (

                                <div className="student-profile-dropdown">


                                    <div className="student-profile-dropdown-header">

                                        <span className="student-avatar large">
                                            K
                                        </span>

                                        <div>

                                            <strong>
                                                Student
                                            </strong>

                                            <span>
                                                Find your future
                                            </span>

                                        </div>

                                    </div>


                                    <div className="student-dropdown-divider" />


                                    <Link
                                        to="/student/profile"
                                        className="student-dropdown-link"
                                        onClick={() =>
                                            setProfileOpen(false)
                                        }
                                    >

                                        <User size={16} />

                                        <span>
                                            My Profile
                                        </span>

                                    </Link>


                                    <Link
                                        to="/student/saved"
                                        className="student-dropdown-link"
                                        onClick={() =>
                                            setProfileOpen(false)
                                        }
                                    >

                                        <Heart size={16} />

                                        <span>
                                            Saved Programs
                                        </span>

                                    </Link>


                                    <Link
                                        to="/student/applications"
                                        className="student-dropdown-link"
                                        onClick={() =>
                                            setProfileOpen(false)
                                        }
                                    >

                                        <GraduationCap size={16} />

                                        <span>
                                            My Applications
                                        </span>

                                    </Link>


                                    <div className="student-dropdown-divider" />


                                    <button
                                        type="button"
                                        className="student-dropdown-logout"
                                        onClick={handleLogout}
                                    >

                                        <LogOut size={16} />

                                        <span>
                                            Log out
                                        </span>

                                    </button>


                                </div>

                            )}

                        </div>


                    </div>

                </div>

            </header>


            {/* =================================================
                Mobile Navigation
            ================================================= */}

            <div
                className={`student-mobile-navigation ${mobileMenuOpen
                        ? "open"
                        : ""
                    }`}
            >

                <div className="student-mobile-navigation-inner">


                    <div className="student-mobile-section">

                        <span className="student-mobile-section-title">
                            Discover
                        </span>


                        {navigation.map((item) => {

                            const Icon = item.icon;

                            return (

                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    onClick={
                                        handleMobileNavigation
                                    }
                                    className={({ isActive }) =>
                                        `student-mobile-link ${isActive
                                            ? "active"
                                            : ""
                                        }`
                                    }
                                >

                                    <Icon size={18} />

                                    <span>
                                        {item.label}
                                    </span>

                                </NavLink>

                            );

                        })}

                    </div>


                    <div className="student-mobile-section">

                        <span className="student-mobile-section-title">
                            Your Journey
                        </span>


                        {personalNavigation.map((item) => {

                            const Icon = item.icon;

                            return (

                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    onClick={
                                        handleMobileNavigation
                                    }
                                    className={({ isActive }) =>
                                        `student-mobile-link ${isActive
                                            ? "active"
                                            : ""
                                        }`
                                    }
                                >

                                    <Icon size={18} />

                                    <span>
                                        {item.label}
                                    </span>

                                </NavLink>

                            );

                        })}

                    </div>


                    <div className="student-mobile-section">

                        <NavLink
                            to="/student/profile"
                            onClick={handleMobileNavigation}
                            className={({ isActive }) =>
                                `student-mobile-link ${isActive
                                    ? "active"
                                    : ""
                                }`
                            }
                        >

                            <User size={18} />

                            <span>
                                Profile
                            </span>

                        </NavLink>


                        <button
                            type="button"
                            className="student-mobile-logout"
                            onClick={handleLogout}
                        >

                            <LogOut size={18} />

                            <span>
                                Log out
                            </span>

                        </button>

                    </div>


                </div>

            </div>


            {/* =================================================
                Main Content
            ================================================= */}

            <main className="student-main">

                <div className="student-main-container">

                    <Outlet />

                </div>

            </main>


            {/* =================================================
                Footer
            ================================================= */}

            <StudentFooter />


        </div>

    );

}


export default StudentLayout;
