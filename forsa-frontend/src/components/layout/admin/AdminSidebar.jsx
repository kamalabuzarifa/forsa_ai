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
    BookOpen,
    Briefcase,
    ShieldCheck,
    PieChart,
    LogOut,
    X,
} from "lucide-react";

import { useAuth } from "../../../context/AuthContext";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

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
            icon: BookOpen,
            links: [
                { label: "Countries", href: "/admin/countries", icon: Globe2 },
                { label: "Universities", href: "/admin/universities", icon: Building2 },
                { label: "Programs", href: "/admin/programs", icon: GraduationCap },
            ],
        },
        {
            label: "Opportunity Management",
            icon: Briefcase,
            links: [
                { label: "Opportunities", href: "/admin/opportunities", icon: GraduationCap },
            ],
        },
        {
            label: "Student Management",
            icon: Users,
            links: [
                { label: "Students", href: "/admin/students", icon: Users },
                { label: "Applications", href: "/admin/applications", icon: FileText },
            ],
        },
        {
            label: "Access Management",
            icon: ShieldCheck,
            links: [
                { label: "Users & Access", href: "/admin/users", icon: Users },
            ],
        },
        {
            label: "Reports & Analytics",
            icon: PieChart,
            links: [
                { label: "Reports", href: "/admin/reports", icon: BarChart3 },
            ],
        },
    ];

    // --- Functionality below is unchanged from the original component ---

    const isSectionActive = (section) =>
        section.links.some(
            (item) =>
                pathname === item.href || pathname.startsWith(`${item.href}/`)
        );

    const isSectionOpen = (section) =>
        hoveredSection === section.label ||
        clickedSection === section.label ||
        (isSectionActive(section) && closedActiveSection !== section.label);

    const toggleSection = (sectionLabel) => {
        const isOpen = clickedSection === sectionLabel;
        const isActive = sections.some(
            (section) =>
                section.label === sectionLabel && isSectionActive(section)
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

    // --- Visual layer only from here down ---

    const renderLink = (item, { compact = false } = {}) => {
        const Icon = item.icon;

        return (
            <NavLink
                key={item.href}
                to={item.href}
                end={item.href === "/admin"}
                onClick={onClose}
                className={({ isActive }) =>
                    cn(
                        "group relative flex w-full items-center gap-3 rounded-lg border-s-2 border-transparent",
                        "text-sm font-medium transition-colors duration-150",
                        compact ? "px-2.5 py-2" : "px-3 py-2.5",
                        isActive
                            ? "border-primary bg-primary/10 text-primary"
                            : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
                    )
                }
            >
                {({ isActive }) => (
                    <>
                        <Icon
                            className={cn(
                                compact ? "size-3.5" : "size-4",
                                "shrink-0",
                                isActive
                                    ? "text-primary"
                                    : "text-muted-foreground group-hover:text-foreground"
                            )}
                        />
                        <span className="truncate">{item.label}</span>
                    </>
                )}
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
                className={cn(
                    "z-50 flex h-screen w-64 shrink-0 flex-col border-e border-border/70 bg-sidebar",
                    "lg:fixed lg:inset-y-0 lg:start-0 lg:flex",
                    mobileOpen ? "fixed inset-y-0 start-0 flex" : "hidden lg:flex"
                )}
            >
                {/* Header */}
                <div className="flex h-16 shrink-0 items-center justify-between gap-2 px-4">
                    <div className="flex min-w-0 items-center gap-2.5">
                        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
                            <GraduationCap className="size-5" />
                        </div>

                        <div className="min-w-0">
                            <p className="truncate text-[15px] font-semibold leading-tight text-foreground">
                                Admin Portal
                            </p>
                            <p className="truncate text-[11px] font-medium leading-tight text-muted-foreground">
                                EduMatch Administration
                            </p>
                        </div>
                    </div>

                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="shrink-0 lg:hidden"
                        onClick={onClose}
                        aria-label="Close navigation"
                    >
                        <X className="size-5" />
                    </Button>
                </div>

                <Separator />

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto px-4 py-4">
                    {renderLink(dashboardLink)}

                    <div className="mt-5 space-y-5">
                        {sections.map((section) => {
                            const SectionIcon = section.icon;
                            const active = isSectionActive(section);
                            const open = isSectionOpen(section);

                            return (
                                <div
                                    key={section.label}
                                    onMouseEnter={() => setHoveredSection(section.label)}
                                    onMouseLeave={() => setHoveredSection(null)}
                                >
                                    <button
                                        type="button"
                                        onClick={() => toggleSection(section.label)}
                                        aria-expanded={open}
                                        className={cn(
                                            "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left",
                                            "text-sm font-medium transition-colors duration-150",
                                            active
                                                ? "text-primary"
                                                : "text-foreground/80 hover:bg-muted/70 hover:text-foreground"
                                        )}
                                    >
                                        <SectionIcon
                                            className={cn(
                                                "size-4 shrink-0",
                                                active ? "text-primary" : "text-muted-foreground"
                                            )}
                                        />
                                        <span className="flex-1 truncate">{section.label}</span>
                                        <ChevronDown
                                            className={cn(
                                                "size-4 shrink-0 text-muted-foreground transition-transform duration-200",
                                                open && "rotate-180",
                                                active && "text-primary"
                                            )}
                                        />
                                    </button>

                                    <div
                                        className={cn(
                                            "grid transition-all duration-200 ease-out",
                                            open
                                                ? "grid-rows-[1fr] opacity-100"
                                                : "grid-rows-[0fr] opacity-0"
                                        )}
                                    >
                                        <div className="overflow-hidden">
                                            <div className="ms-[18px] mt-1 space-y-1 border-s border-border/70 ps-3">
                                                {section.links.map((item) =>
                                                    renderLink(item, { compact: true })
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </nav>

                <Separator />

                {/* Footer */}
                <div className="shrink-0 px-4 py-3">
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
