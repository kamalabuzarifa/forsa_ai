import { useState } from "react";
import { Outlet } from "react-router-dom";

import AdminSidebar from "./AdminSidebar";
import AdminTopbar from "./AdminTopbar";

function AdminLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen w-full bg-muted/30 text-foreground">
            <div className="flex min-h-screen w-full">
                <AdminSidebar
                    mobileOpen={sidebarOpen}
                    onClose={() => setSidebarOpen(false)}
                />

                <div className="flex min-w-0 flex-1 flex-col">
                    <AdminTopbar
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

export default AdminLayout;
