import {
    Bell,
    Bookmark,
    CheckCheck,
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
import {
    getNotifications,
    markAllNotificationsAsRead,
    markNotificationAsRead,
} from "../../api/notifications";

import "./StudentLayout.css";


function StudentLayout() {

    const navigate = useNavigate();

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadNotifications, setUnreadNotifications] = useState(0);
    const [notificationsLoading, setNotificationsLoading] = useState(false);

    const profileRef = useRef(null);
    const notificationRef = useRef(null);

    const loadNotifications = async () => {
        try {
            setNotificationsLoading(true);

            const response = await getNotifications();

            setNotifications(
                Array.isArray(response?.data)
                    ? response.data
                    : []
            );

            setUnreadNotifications(
                Number(response?.unread_count) || 0
            );
        } catch (error) {
            console.error("Failed to load notifications:", error);
        } finally {
            setNotificationsLoading(false);
        }
    };


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

            if (
                notificationRef.current &&
                !notificationRef.current.contains(event.target)
            ) {
                setNotificationsOpen(false);
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

    useEffect(() => {
        loadNotifications();

        const interval = window.setInterval(
            loadNotifications,
            30000
        );

        return () => window.clearInterval(interval);
    }, []);

    const handleNotificationsToggle = () => {
        const nextOpen = !notificationsOpen;

        setNotificationsOpen(nextOpen);

        if (nextOpen) {
            loadNotifications();
        }
    };

    const handleNotificationClick = async (notification) => {
        if (notification.read_at) {
            return;
        }

        try {
            await markNotificationAsRead(notification.id);

            setNotifications((current) =>
                current.map((item) =>
                    item.id === notification.id
                        ? { ...item, read_at: new Date().toISOString() }
                        : item
                )
            );

            setUnreadNotifications((current) =>
                Math.max(0, current - 1)
            );
        } catch (error) {
            console.error("Failed to mark notification as read:", error);
        }
    };

    const handleMarkAllNotificationsRead = async () => {
        try {
            await markAllNotificationsAsRead();

            setNotifications((current) =>
                current.map((item) => ({
                    ...item,
                    read_at: item.read_at || new Date().toISOString(),
                }))
            );

            setUnreadNotifications(0);
        } catch (error) {
            console.error("Failed to mark notifications as read:", error);
        }
    };


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

                        <div
                            className="student-notification-wrapper"
                            ref={notificationRef}
                        >

                            <button
                                type="button"
                                className="student-header-icon notification-button"
                                title="Notifications"
                                aria-label="Notifications"
                                aria-expanded={notificationsOpen}
                                onClick={handleNotificationsToggle}
                            >

                                <Bell size={18} />

                                {unreadNotifications > 0 && (
                                    <span className="notification-dot">
                                        {unreadNotifications > 9
                                            ? "9+"
                                            : unreadNotifications}
                                    </span>
                                )}

                            </button>

                            {notificationsOpen && (
                                <div className="student-notifications-dropdown">

                                    <div className="student-notifications-header">

                                        <div>
                                            <strong>Notifications</strong>
                                            <span>
                                                {unreadNotifications > 0
                                                    ? `${unreadNotifications} unread`
                                                    : "You are all caught up"}
                                            </span>
                                        </div>

                                        {unreadNotifications > 0 && (
                                            <button
                                                type="button"
                                                className="student-notifications-read-all"
                                                onClick={handleMarkAllNotificationsRead}
                                            >
                                                <CheckCheck size={14} />
                                                Mark all read
                                            </button>
                                        )}

                                    </div>

                                    <div className="student-notifications-list">

                                        {notificationsLoading && (
                                            <div className="student-notifications-state">
                                                Loading notifications...
                                            </div>
                                        )}

                                        {!notificationsLoading && notifications.length === 0 && (
                                            <div className="student-notifications-state">
                                                No notifications yet.
                                            </div>
                                        )}

                                        {!notificationsLoading && notifications.map((notification) => (
                                            <button
                                                type="button"
                                                className={`student-notification-item ${notification.read_at ? "read" : "unread"}`}
                                                key={notification.id}
                                                onClick={() => handleNotificationClick(notification)}
                                            >
                                                <span className="student-notification-indicator" />
                                                <span className="student-notification-content">
                                                    <strong>{notification.title}</strong>
                                                    <span>{notification.message}</span>
                                                    <small>
                                                        {notification.created_at
                                                            ? new Date(notification.created_at).toLocaleDateString()
                                                            : ""}
                                                    </small>
                                                </span>
                                            </button>
                                        ))}

                                    </div>

                                </div>
                            )}

                        </div>


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
