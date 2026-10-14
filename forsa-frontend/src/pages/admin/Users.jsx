import { useCallback, useEffect, useMemo, useState } from "react";
import { Search, ShieldCheck, Trash2, UserRound, UsersRound, XCircle } from "lucide-react";

import {
    deleteAdminUser,
    getAdminUsers,
    getAdminRoles,
    updateAdminUser,
} from "../../api/admin";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const getErrorMessage = (error, fallback) => {
    const response = error?.response?.data;
    const firstValidationError = response?.errors
        ? Object.values(response.errors).flat().find(Boolean)
        : null;

    return response?.message || firstValidationError || fallback;
};

const getUsers = (response) => response?.data ?? [];

function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [savingId, setSavingId] = useState(null);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const loadUsers = useCallback(async () => {
        try {
            setLoading(true);
            setError("");
            const [response, rolesResponse] = await Promise.all([
                getAdminUsers(1, search.trim()),
                getAdminRoles(),
            ]);
            setUsers(getUsers(response));
            setRoles(rolesResponse?.roles || []);
        } catch (loadError) {
            setError(getErrorMessage(loadError, "Failed to load users."));
        } finally {
            setLoading(false);
        }
    }, [search]);

    useEffect(() => {
        const timer = window.setTimeout(loadUsers, 250);
        return () => window.clearTimeout(timer);
    }, [loadUsers]);

    const students = useMemo(
        () => users.filter((user) => user.role === "student").length,
        [users]
    );

    const updateUser = async (user, field, value) => {
        try {
            setSavingId(user.id);
            setError("");
            setSuccess("");
            const response = await updateAdminUser(user.id, { [field]: value });
            const updatedUser = response.user || { ...user, [field]: value };
            setUsers((current) => current.map((item) => item.id === user.id ? { ...item, ...updatedUser } : item));
            setSuccess("User access updated successfully.");
        } catch (updateError) {
            setError(getErrorMessage(updateError, "Failed to update user access."));
        } finally {
            setSavingId(null);
        }
    };

    const getRoleIds = (user) =>
        (user.roles || []).map((role) => String(role.id));

    const removeUser = async (user) => {
        if (!window.confirm(`Delete ${user.name}?`)) return;

        try {
            setSavingId(user.id);
            setError("");
            await deleteAdminUser(user.id);
            setUsers((current) => current.filter((item) => item.id !== user.id));
            setSuccess("User deleted successfully.");
        } catch (deleteError) {
            setError(getErrorMessage(deleteError, "Failed to delete user."));
        } finally {
            setSavingId(null);
        }
    };

    return (
        <div className="w-full">
            <div className="admin-content-width space-y-6">
                <section>
                    <Badge variant="secondary" className="mb-2">Admin control</Badge>
                    <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Users & access</h1>
                    <p className="mt-2 text-sm text-muted-foreground sm:text-base">Control accounts, roles, and platform access from one place.</p>
                </section>

                {error && <div className="flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive"><XCircle className="mt-0.5 size-4 shrink-0" /><p>{error}</p></div>}
                {success && <div className="rounded-xl border border-green-500/30 bg-green-500/5 px-4 py-3 text-sm text-green-700">{success}</div>}

                <div className="grid gap-4 sm:grid-cols-3">
                    <Card><CardContent className="flex items-center gap-3 pt-4"><UsersRound className="size-5 text-primary" /><div><p className="text-xs text-muted-foreground">Visible accounts</p><p className="text-2xl font-semibold">{users.length}</p></div></CardContent></Card>
                    <Card><CardContent className="flex items-center gap-3 pt-4"><UserRound className="size-5 text-primary" /><div><p className="text-xs text-muted-foreground">Students</p><p className="text-2xl font-semibold">{students}</p></div></CardContent></Card>
                    <Card><CardContent className="flex items-center gap-3 pt-4"><ShieldCheck className="size-5 text-primary" /><div><p className="text-xs text-muted-foreground">Administrators</p><p className="text-2xl font-semibold">{users.length - students}</p></div></CardContent></Card>
                </div>

                <Card>
                    <CardHeader className="gap-4 border-b sm:flex-row sm:items-center sm:justify-between">
                        <div><CardTitle>Account directory</CardTitle><CardDescription>Search users and adjust their access without leaving the admin portal.</CardDescription></div>
                        <div className="relative w-full sm:w-72"><Search className="absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input className="ps-9" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search name or email" /></div>
                    </CardHeader>
                    <CardContent className="p-0">
                        {loading ? <div className="p-6 text-sm text-muted-foreground">Loading users...</div> : users.length === 0 ? <div className="p-6 text-sm text-muted-foreground">No users found.</div> : <div className="overflow-x-auto"><table className="w-full min-w-[900px] text-sm"><thead className="bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground"><tr><th className="px-6 py-3">User</th><th className="px-6 py-3">Legacy role</th><th className="px-6 py-3">Assigned roles</th><th className="px-6 py-3">Status</th><th className="px-6 py-3">Applications</th><th className="px-6 py-3 text-right">Actions</th></tr></thead><tbody className="divide-y">{users.map((user) => <tr key={user.id} className="align-middle"><td className="px-6 py-4"><p className="font-medium">{user.name}</p><p className="text-xs text-muted-foreground">{user.email}</p></td><td className="px-6 py-4"><select className="h-9 rounded-md border bg-background px-2 text-sm" value={user.role} disabled={savingId === user.id} onChange={(event) => updateUser(user, "role", event.target.value)}><option value="student">Student</option><option value="admin">Administrator</option></select></td><td className="px-6 py-4"><select multiple size={Math.min(Math.max(roles.length, 2), 4)} className="min-h-20 w-48 rounded-md border bg-background p-1 text-sm" value={getRoleIds(user)} disabled={savingId === user.id} onChange={(event) => updateUser(user, "role_ids", Array.from(event.target.selectedOptions, (option) => Number(option.value)))}>{roles.map((role) => <option key={role.id} value={role.id}>{role.label}</option>)}</select></td><td className="px-6 py-4"><select className="h-9 rounded-md border bg-background px-2 text-sm" value={user.status} disabled={savingId === user.id} onChange={(event) => updateUser(user, "status", event.target.value)}><option value="active">Active</option><option value="inactive">Inactive</option><option value="suspended">Suspended</option></select></td><td className="px-6 py-4 text-muted-foreground">{user.applications_count ?? 0}</td><td className="px-6 py-4 text-right"><Button type="button" variant="ghost" size="icon" className="text-destructive hover:text-destructive" disabled={savingId === user.id} onClick={() => removeUser(user)} aria-label={`Delete ${user.name}`}><Trash2 className="size-4" /></Button></td></tr>)}</tbody></table></div>}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export default AdminUsers;
