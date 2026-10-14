import { useEffect, useMemo, useState } from "react";
import { Pencil, Plus, ShieldCheck, Trash2, X } from "lucide-react";

import {
    createAdminRole,
    deleteAdminRole,
    getAdminRoles,
    updateAdminRole,
} from "../../api/admin";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const emptyForm = {
    name: "",
    label: "",
    permission_ids: [],
};

const getErrorMessage = (error) => {
    const response = error?.response?.data;
    const validation = response?.errors;
    const firstValidationError = validation
        ? Object.values(validation).flat().find(Boolean)
        : "";

    return (
        response?.message ||
        firstValidationError ||
        error?.message ||
        "Unable to update roles."
    );
};

function Roles() {
    const [roles, setRoles] = useState([]);
    const [permissions, setPermissions] = useState([]);
    const [form, setForm] = useState(emptyForm);
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const permissionsByModule = useMemo(() => {
        return permissions.reduce((groups, permission) => {
            const module = permission.module || "other";
            groups[module] = groups[module] || [];
            groups[module].push(permission);
            return groups;
        }, {});
    }, [permissions]);

    const loadRoles = async () => {
        try {
            setLoading(true);
            setError("");
            const response = await getAdminRoles();
            setRoles(response?.roles || []);
            setPermissions(response?.permissions || []);
        } catch (loadError) {
            setError(getErrorMessage(loadError));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let mounted = true;

        const loadInitialRoles = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await getAdminRoles();

                if (!mounted) {
                    return;
                }

                setRoles(response?.roles || []);
                setPermissions(response?.permissions || []);
            } catch (loadError) {
                if (mounted) {
                    setError(getErrorMessage(loadError));
                }
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        };

        loadInitialRoles();

        return () => {
            mounted = false;
        };
    }, []);

    const resetForm = () => {
        setForm(emptyForm);
        setEditingId(null);
    };

    const togglePermission = (permissionId) => {
        setForm((current) => ({
            ...current,
            permission_ids: current.permission_ids.includes(permissionId)
                ? current.permission_ids.filter((id) => id !== permissionId)
                : [...current.permission_ids, permissionId],
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");
        setSuccess("");

        try {
            setSaving(true);
            if (editingId) {
                await updateAdminRole(editingId, {
                    label: form.label.trim(),
                    permission_ids: form.permission_ids,
                });
                setSuccess("Role updated successfully.");
            } else {
                await createAdminRole({
                    name: form.name.trim(),
                    label: form.label.trim(),
                    permission_ids: form.permission_ids,
                });
                setSuccess("Role created successfully.");
            }
            resetForm();
            await loadRoles();
        } catch (saveError) {
            setError(getErrorMessage(saveError));
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (role) => {
        setEditingId(role.id);
        setForm({
            name: role.name,
            label: role.label,
            permission_ids: (role.permissions || []).map((permission) => permission.id),
        });
        setError("");
        setSuccess("");
    };

    const handleDelete = async (role) => {
        if (!window.confirm(`Delete ${role.label}?`)) {
            return;
        }

        try {
            setError("");
            await deleteAdminRole(role.id);
            setSuccess("Role deleted successfully.");
            await loadRoles();
        } catch (deleteError) {
            setError(getErrorMessage(deleteError));
        }
    };

    return (
        <div className="admin-content-width">
            <div>
                <p className="text-sm font-medium text-primary">Access Management</p>
                <h1 className="text-3xl font-semibold tracking-tight">Roles & Permissions</h1>
                <p className="mt-2 text-muted-foreground">
                    Manage explicit permissions without changing the existing student and admin roles.
                </p>
            </div>

            {error && <div className="rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">{error}</div>}
            {success && <div className="rounded-md border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">{success}</div>}

            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
                <Card>
                    <CardHeader>
                        <CardTitle>Available roles</CardTitle>
                        <CardDescription>Default roles are protected from deletion.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {loading ? (
                            <p className="text-sm text-muted-foreground">Loading roles...</p>
                        ) : roles.length === 0 ? (
                            <p className="text-sm text-muted-foreground">No roles configured.</p>
                        ) : roles.map((role) => (
                            <div key={role.id} className="flex items-center justify-between gap-4 rounded-lg border p-4">
                                <div className="min-w-0">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <ShieldCheck className="size-4 text-primary" />
                                        <strong>{role.label}</strong>
                                        <Badge variant="secondary">{role.name}</Badge>
                                    </div>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        {role.users_count || 0} users · {(role.permissions || []).length} permissions
                                    </p>
                                </div>
                                <div className="flex shrink-0 gap-2">
                                    <Button type="button" variant="outline" size="icon" onClick={() => handleEdit(role)} aria-label={`Edit ${role.label}`}>
                                        <Pencil className="size-4" />
                                    </Button>
                                    <Button type="button" variant="outline" size="icon" onClick={() => handleDelete(role)} aria-label={`Delete ${role.label}`}>
                                        <Trash2 className="size-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>{editingId ? "Edit role" : "Create role"}</CardTitle>
                        <CardDescription>Assign only the permissions this role needs.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form className="space-y-4" onSubmit={handleSubmit}>
                            <Input
                                value={form.name}
                                disabled={Boolean(editingId)}
                                onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                                placeholder="role_name"
                                required
                            />
                            <Input
                                value={form.label}
                                onChange={(event) => setForm((current) => ({ ...current, label: event.target.value }))}
                                placeholder="Role label"
                                required
                            />

                            <div className="max-h-80 space-y-4 overflow-y-auto rounded-md border p-3">
                                {Object.entries(permissionsByModule).map(([module, modulePermissions]) => (
                                    <fieldset key={module} className="space-y-2">
                                        <legend className="text-sm font-semibold capitalize">{module.replace(/_/g, " ")}</legend>
                                        {modulePermissions.map((permission) => (
                                            <label key={permission.id} className="flex items-start gap-2 text-sm">
                                                <input
                                                    type="checkbox"
                                                    checked={form.permission_ids.includes(permission.id)}
                                                    onChange={() => togglePermission(permission.id)}
                                                    className="mt-1"
                                                />
                                                <span>{permission.label}</span>
                                            </label>
                                        ))}
                                    </fieldset>
                                ))}
                            </div>

                            <div className="flex gap-2">
                                <Button type="submit" disabled={saving}>
                                    <Plus className="size-4" />
                                    {saving ? "Saving..." : editingId ? "Save changes" : "Create role"}
                                </Button>
                                {editingId && (
                                    <Button type="button" variant="ghost" onClick={resetForm}>
                                        <X className="size-4" />
                                        Cancel
                                    </Button>
                                )}
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export default Roles;
