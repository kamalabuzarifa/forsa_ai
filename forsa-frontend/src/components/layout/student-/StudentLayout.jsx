import { useState } from "react";
import { Outlet } from "react-router-dom";

import StudentSidebar from "./StudentSidebar";
import StudentTopbar from "./StudentTopbar";

function StudentLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen w-full bg-muted/30 text-foreground">
            <div className="flex min-h-screen w-full">
                <StudentSidebar
                    mobileOpen={sidebarOpen}
                    onClose={() => setSidebarOpen(false)}
                />

                <div className="flex min-w-0 flex-1 flex-col">
                    <StudentTopbar
                        onMenuClick={() => setSidebarOpen(true)}
                    />

                    <main className="min-w-0 flex-1">
                        <Outlet />
                    </main>
                </div>
            </div>
        </div>
    );
}

export default StudentLayout;
