import { NavLink, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import {
    ChevronDown,
    LayoutDashboard,
    GraduationCap,
    FileText,
    Globe2,
    Building2,
    Users,
    BarChart3,
    LogOut,
    X,
} from "lucide-react";

import { useAuth } from "../../../context/AuthContext";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

function AdminSidebar({ mobileOpen, onClose }) {
    const { logout } = useAuth();
    const { pathname } = useLocation();
    const [clickedSection, setClickedSection] = useState(null);
    const [hoveredSection, setHoveredSection] = useState(null);
    const [closedActiveSection, setClosedActiveSection] = useState(null);

    const dashboardLink = {
        label: "Dashboard",
        href: "/admin",
        icon: LayoutDashboard,
    };

    const sections = [
        {
            label: "Academic Management",
            links: [
                {
                    label: "Countries",
                    href: "/admin/countries",
                    icon: Globe2,
                },
                {
                    label: "Universities",
                    href: "/admin/universities",
                    icon: Building2,
                },
                {
                    label: "Programs",
                    href: "/admin/programs",
                    icon: GraduationCap,
                },
            ],
        },
        {
            label: "Opportunity Management",
            links: [
                {
                    label: "Opportunities",
                    href: "/admin/opportunities",
                    icon: GraduationCap,
                },
            ],
        },
        {
            label: "Student Management",
            links: [
                {
                    label: "Students",
                    href: "/admin/students",
                    icon: Users,
                },
                {
                    label: "Applications",
                    href: "/admin/applications",
                    icon: FileText,
                },
            ],
        },
        {
            label: "Access Management",
            links: [
                {
                    label: "Users & Access",
                    href: "/admin/users",
                    icon: Users,
                },
            ],
        },
        {
            label: "Reports & Analytics",
            links: [
                {
                    label: "Reports",
                    href: "/admin/reports",
                    icon: BarChart3,
                },
            ],
        },
    ];

    const getLinkClass = ({ isActive }) =>
        [
            "flex w-full items-center gap-3 rounded-lg px-3 py-2.5",
            "text-sm font-medium transition-colors",
            isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
        ].join(" ");

    const isSectionActive = (section) =>
        section.links.some(
            (item) =>
                pathname === item.href ||
                pathname.startsWith(`${item.href}/`)
        );

    const toggleSection = (sectionLabel) => {
        const isOpen = clickedSection === sectionLabel;
        const isActive = sections.some(
            (section) =>
                section.label === sectionLabel &&
                isSectionActive(section)
        );

        if (isOpen || (isActive && closedActiveSection !== sectionLabel)) {
            setClickedSection(null);
            setClosedActiveSection(sectionLabel);
            return;
        }

        setClickedSection(sectionLabel);
        setClosedActiveSection(null);
    };

    useEffect(() => {
        setClosedActiveSection(null);
    }, [pathname]);

    const renderLink = (item) => {
        const Icon = item.icon;

        return (
            <NavLink
                key={item.href}
                to={item.href}
                end={item.href === "/admin"}
                className={getLinkClass}
                onClick={onClose}
            >
                <Icon className="size-4 shrink-0" />

                <span className="truncate">
                    {item.label}
                </span>
            </NavLink>
        );
    };

    return (
        <>
            {mobileOpen && (
                <button
                    type="button"
                    aria-label="Close sidebar"
                    className="fixed inset-0 z-40 bg-black/40 lg:hidden"
                    onClick={onClose}
                />
            )}

            <aside
                className={[
                    "z-50 flex h-screen w-64 shrink-0 flex-col border-e bg-sidebar",
                    "lg:fixed lg:inset-y-0 lg:start-0 lg:flex",
                    mobileOpen
                        ? "fixed inset-y-0 start-0 flex"
                        : "hidden lg:flex",
                ].join(" ")}
            >
                <div className="flex h-16 shrink-0 items-center justify-between px-5">
                    <div className="flex items-center gap-3">
                        <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                            <GraduationCap className="size-5" />
                        </div>

                        <div className="min-w-0">
                            <p className="truncate font-semibold">
                                EduMatch
                            </p>

                            <p className="truncate text-xs text-muted-foreground">
                                Admin Portal
                            </p>
                        </div>
                    </div>

                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="lg:hidden"
                        onClick={onClose}
                    >
                        <X className="size-5" />
                    </Button>
                </div>

                <Separator />

                <div className="flex-1 overflow-y-auto px-3 py-5">
                    <nav className="space-y-5">
                        {renderLink(dashboardLink)}

                        {sections.map((section) => (
                            <div
                                key={section.label}
                                className="space-y-1"
                                onMouseEnter={() =>
                                    setHoveredSection(section.label)
                                }
                                onMouseLeave={() =>
                                    setHoveredSection(null)
                                }
                            >
                                <button
                                    type="button"
                                    className={[
                                        "flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-left",
                                        "text-[11px] font-semibold uppercase tracking-wider transition-colors",
                                        isSectionActive(section)
                                            ? "bg-primary/10 text-primary"
                                            : "text-muted-foreground hover:bg-muted hover:text-foreground",
                                    ].join(" ")}
                                    onClick={() =>
                                        toggleSection(section.label)
                                    }
                                    aria-expanded={
                                        hoveredSection === section.label ||
                                        clickedSection === section.label ||
                                        (isSectionActive(section) &&
                                            closedActiveSection !== section.label)
                                    }
                                >
                                    <span>{section.label}</span>

                                    <ChevronDown
                                        className={[
                                            "size-3.5 shrink-0 transition-transform duration-200",
                                            hoveredSection === section.label ||
                                                clickedSection === section.label ||
                                                (isSectionActive(section) &&
                                                    closedActiveSection !== section.label)
                                                ? "rotate-180"
                                                : "",
                                        ].join(" ")}
                                    />
                                </button>

                                <div
                                    className={[
                                        "overflow-hidden transition-all duration-200 ease-out",
                                        hoveredSection === section.label ||
                                            clickedSection === section.label ||
                                            (isSectionActive(section) &&
                                                closedActiveSection !== section.label)
                                            ? "max-h-48 opacity-100"
                                            : "pointer-events-none max-h-0 opacity-0",
                                    ].join(" ")}
                                >
                                    <div className="ms-3 space-y-1 border-s border-border/70 ps-2">
                                        {section.links.map(renderLink)}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </nav>
                </div>

                <div className="shrink-0 border-t p-3">
                    <Button
                        type="button"
                        variant="ghost"
                        className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive"
                        onClick={logout}
                    >
                        <LogOut className="size-4" />

                        <span>Logout</span>
                    </Button>
                </div>
            </aside>
        </>
    );
}

export default AdminSidebar;
