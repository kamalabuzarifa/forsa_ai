import { Bell, Menu } from "lucide-react";

import { useAuth } from "../../../context/AuthContext";

import { Button } from "@/components/ui/button";

function AdminTopbar({ onMenuClick }) {
    const { user } = useAuth();

    const initial =
        user?.name?.trim()?.charAt(0)?.toUpperCase() || "A";

    return (
        <header className="sticky top-0 z-30 h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
            <div className="flex h-full items-center gap-3 px-4 sm:px-6">
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="lg:hidden"
                    onClick={onMenuClick}
                    aria-label="Open navigation"
                >
                    <Menu className="size-5" />
                </Button>

                <div className="ms-auto flex items-center gap-2">
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        aria-label="Notifications"
                    >
                        <Bell className="size-5" />
                    </Button>

                    <div className="hidden h-8 w-px bg-border sm:block" />

                    <div className="hidden text-end sm:block">
                        <p className="max-w-48 truncate text-sm font-medium">
                            {user?.name || "Administrator"}
                        </p>

                        <p className="max-w-56 truncate text-xs text-muted-foreground">
                            {user?.email || ""}
                        </p>
                    </div>

                    <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                        {initial}
                    </div>
                </div>
            </div>
        </header>
    );
}

export default AdminTopbar;
