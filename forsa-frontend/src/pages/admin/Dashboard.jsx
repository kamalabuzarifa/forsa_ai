import { useCallback, useEffect, useState } from "react";
import { Activity, ArrowUpRight, Building2, CalendarDays, FileText, Globe2, GraduationCap, RefreshCw, Users } from "lucide-react";
import { Link } from "react-router-dom";

import { getAdminDashboard } from "../../api/admin";
import "./Dashboard.css";

const number = (value) => Number(value || 0).toLocaleString();
const formatDate = (value) => value ? new Date(value).toLocaleDateString("en-GB", { day: "2-digit", month: "short" }) : "N/A";
const label = (value) => String(value || "pending").replace(/[_-]/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());

function AdminDashboardSkeleton() {
    return (
        <div className="admin-dashboard-page">
            <div className="admin-dashboard-container admin-dashboard-skeleton">
                <div className="admin-dashboard-skeleton-header">
                    <div>
                        <span className="admin-skeleton-line admin-skeleton-eyebrow" />
                        <span className="admin-skeleton-line admin-skeleton-title" />
                        <span className="admin-skeleton-line admin-skeleton-subtitle" />
                    </div>

                    <span className="admin-skeleton-button" />
                </div>

                <section className="admin-dashboard-metrics">
                    {[1, 2, 3, 4].map((item) => (
                        <div
                            className="admin-metric-card admin-skeleton-card"
                            key={item}
                        >
                            <span className="admin-skeleton-icon" />
                            <span className="admin-skeleton-copy">
                                <span className="admin-skeleton-line admin-skeleton-label" />
                                <span className="admin-skeleton-line admin-skeleton-value" />
                            </span>
                        </div>
                    ))}
                </section>

                <section className="admin-dashboard-profile-strip admin-skeleton-card admin-skeleton-profile" />

                <div className="admin-dashboard-grid admin-dashboard-grid-top">
                    {[1, 2].map((item) => (
                        <section className="admin-dashboard-panel admin-skeleton-card admin-skeleton-panel" key={item}>
                            <span className="admin-skeleton-line admin-skeleton-panel-title" />
                            <span className="admin-skeleton-line admin-skeleton-panel-heading" />
                            {[1, 2, 3, 4].map((row) => (
                                <span className="admin-skeleton-row" key={row} />
                            ))}
                        </section>
                    ))}
                </div>
            </div>
        </div>
    );
}

function AdminDashboard() {
    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadDashboard = useCallback(async () => {
        try {
            setLoading(true);
            setError("");
            setDashboard(await getAdminDashboard());
        } catch (loadError) {
            setError(loadError?.response?.data?.message || "Failed to load dashboard data.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const timer = window.setTimeout(loadDashboard, 0);

        return () => window.clearTimeout(timer);
    }, [loadDashboard]);

    if (loading) return <AdminDashboardSkeleton />;
    if (error) return <div className="admin-dashboard-container"><div className="admin-dashboard-error"><Activity /><div><strong>Dashboard unavailable</strong><p>{error}</p></div><button type="button" onClick={loadDashboard}><RefreshCw size={14} /> Retry</button></div></div>;

    const metrics = dashboard?.metrics || {};
    const recentApplications = dashboard?.recent_applications || [];
    const recentUsers = dashboard?.recent_users || [];
    const upcomingDeadlines = dashboard?.upcoming_deadlines || [];
    const statusEntries = Object.entries(dashboard?.applications_by_status || {});
    const maxStatus = Math.max(...statusEntries.map(([, total]) => Number(total)), 1);
    const cards = [
        [Users, "Students", metrics.total_students, "/admin/users"],
        [FileText, "Applications", metrics.total_applications, "/admin/applications"],
        [GraduationCap, "Opportunities", metrics.total_opportunities, "/admin/opportunities"],
        [Building2, "Universities", metrics.total_universities, "/admin/universities"],
    ];

    return <div className="admin-dashboard-page"><div className="admin-dashboard-container">
        <header className="admin-dashboard-header"><div><span className="admin-dashboard-eyebrow">Operations overview</span><h1>Admin dashboard</h1><p>Monitor access, applications, and the education catalogue.</p></div><button className="admin-dashboard-refresh" type="button" onClick={loadDashboard}><RefreshCw size={14} /> Refresh data</button></header>
        <section className="admin-dashboard-metrics">{cards.map(([Icon, title, value, href]) => <Link className="admin-metric-card" to={href} key={title}><div className="admin-metric-icon"><Icon size={18} /></div><div><span>{title}</span><strong>{number(value)}</strong></div><ArrowUpRight size={14} /></Link>)}</section>
        <section className="admin-dashboard-profile-strip"><div><Activity size={18} /><span>Active opportunities</span><strong>{number(metrics.active_opportunities)}</strong></div><div><Globe2 size={18} /><span>Countries</span><strong>{number(metrics.total_countries)}</strong></div><div><FileText size={18} /><span>Pending review</span><strong>{number(metrics.pending_applications)}</strong></div><p>Average profile completion is <strong>{number(metrics.average_profile_completion)}%</strong>. {number(metrics.complete_profiles)} student profiles are complete.</p></section>
        <div className="admin-dashboard-grid admin-dashboard-grid-top"><section className="admin-dashboard-panel"><div className="admin-panel-heading"><div><span>Application flow</span><h2>Status distribution</h2></div><FileText size={18} /></div><div className="admin-bars">{statusEntries.length ? statusEntries.map(([status, total]) => <div className="admin-bar-row" key={status}><span>{label(status)}</span><div><i style={{ width: `${Math.max((Number(total) / maxStatus) * 100, 4)}%` }} /></div><strong>{number(total)}</strong></div>) : <p className="admin-empty">No applications yet.</p>}</div></section><section className="admin-dashboard-panel"><div className="admin-panel-heading"><div><span>Latest activity</span><h2>Recent applications</h2></div><Link to="/admin/applications">View all</Link></div><div className="admin-list">{recentApplications.length ? recentApplications.map((application) => <Link className="admin-list-row" to={`/admin/applications/${application.id}`} key={application.id}><div className="admin-list-avatar">{String(application.student || "S").charAt(0)}</div><div><strong>{application.student || "Unknown student"}</strong><span>{application.opportunity || "Opportunity"}</span></div><span className={`admin-status-pill ${application.status}`}>{label(application.status)}</span><time>{formatDate(application.created_at)}</time></Link>) : <p className="admin-empty">No recent applications.</p>}</div></section></div>
        <div className="admin-dashboard-grid admin-dashboard-grid-bottom"><section className="admin-dashboard-panel"><div className="admin-panel-heading"><div><span>Access</span><h2>New users</h2></div><Link to="/admin/users">Manage</Link></div><div className="admin-list">{recentUsers.length ? recentUsers.map((user) => <Link className="admin-list-row" to="/admin/users" key={user.id}><div className="admin-list-avatar">{String(user.name || "U").charAt(0)}</div><div><strong>{user.name}</strong><span>{user.email}</span></div><time>{formatDate(user.created_at)}</time></Link>) : <p className="admin-empty">No new users.</p>}</div></section><section className="admin-dashboard-panel"><div className="admin-panel-heading"><div><span>Deadlines</span><h2>Upcoming</h2></div><CalendarDays size={18} /></div><div className="admin-list">{upcomingDeadlines.length ? upcomingDeadlines.map((opportunity) => <Link className="admin-list-row" to={`/admin/opportunities/${opportunity.id}`} key={opportunity.id}><div className="admin-list-icon"><CalendarDays size={14} /></div><div><strong>{opportunity.title}</strong><span>{label(opportunity.status)}</span></div><time>{formatDate(opportunity.deadline)}</time></Link>) : <p className="admin-empty">No upcoming deadlines.</p>}</div></section><section className="admin-dashboard-panel"><div className="admin-panel-heading"><div><span>Catalogue</span><h2>Quick actions</h2></div><GraduationCap size={18} /></div><div className="admin-list"><Link className="admin-list-row" to="/admin/opportunities/create"><div className="admin-list-icon"><GraduationCap size={14} /></div><div><strong>Add opportunity</strong><span>Publish a new programme</span></div><ArrowUpRight size={14} /></Link><Link className="admin-list-row" to="/admin/universities"><div className="admin-list-icon"><Building2 size={14} /></div><div><strong>Review universities</strong><span>Keep institution data current</span></div><ArrowUpRight size={14} /></Link></div></section></div>
    </div></div>;
}

export default AdminDashboard;
