import { NavLink } from "react-router-dom";
import {
    LayoutDashboard,
    GraduationCap,
    Sparkles,
    FileText,
    User,
    LogOut,
    X,
} from "lucide-react";

import { useAuth } from "../../../context/AuthContext";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

function StudentSidebar({ mobileOpen, onClose }) {
    const { logout } = useAuth();

    const links = [
        {
            label: "Dashboard",
            href: "/student",
            icon: LayoutDashboard,
        },
        {
            label: "Profile",
            href: "/student/profile",
            icon: User,
        },
        {
            label: "Opportunities",
            href: "/student/opportunities",
            icon: GraduationCap,
        },
        {
            label: "Recommended",
            href: "/student/recommended",
            icon: Sparkles,
        },
        {
            label: "My Applications",
            href: "/student/applications",
            icon: FileText,
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
                    "lg:sticky lg:top-0 lg:flex",
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
                                Student Portal
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
                    <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Menu
                    </p>

                    <nav className="space-y-1">
                        {links.map((item) => {
                            const Icon = item.icon;

                            return (
                                <NavLink
                                    key={item.href}
                                    to={item.href}
                                    end={item.href === "/student"}
                                    className={getLinkClass}
                                    onClick={onClose}
                                >
                                    <Icon className="size-4 shrink-0" />

                                    <span className="truncate">
                                        {item.label}
                                    </span>
                                </NavLink>
                            );
                        })}
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

export default StudentSidebar;
