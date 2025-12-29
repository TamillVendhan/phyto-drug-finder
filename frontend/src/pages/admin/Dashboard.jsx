import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../api/api";
import Loader from "../../components/Loader";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("admin/stats.php")
      .then(res => setStats(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="admin-dashboard">
      <h1>🎛️ Admin Dashboard</h1>

      {/* Stats Overview */}
      <div className="admin-stats">
        <div className="admin-stat-card">
          <h3>{stats?.plants || 0}</h3>
          <p>Plants</p>
        </div>
        <div className="admin-stat-card">
          <h3>{stats?.compounds || 0}</h3>
          <p>Compounds</p>
        </div>
        <div className="admin-stat-card pending">
          <h3>{stats?.pending_cases || 0}</h3>
          <p>Pending Cases</p>
        </div>
        <div className="admin-stat-card pending">
          <h3>{stats?.pending_images || 0}</h3>
          <p>Pending Images</p>
        </div>
        <div className="admin-stat-card">
          <h3>{stats?.feedback || 0}</h3>
          <p>Feedback</p>
        </div>
        <div className="admin-stat-card">
          <h3>{stats?.users || 0}</h3>
          <p>Users</p>
        </div>
      </div>

      {/* Quick Links */}
      <div className="admin-actions">
        <h2>Quick Actions</h2>
        <div className="action-grid">
          <Link to="/admin/plants" className="action-card">
            <span>🌿</span>
            <h4>Manage Plants</h4>
            <p>Add, edit, or delete plants</p>
          </Link>
          <Link to="/admin/case-studies" className="action-card">
            <span>📄</span>
            <h4>Case Studies</h4>
            <p>Approve pending submissions</p>
          </Link>
          <Link to="/admin/images" className="action-card">
            <span>🖼️</span>
            <h4>Images</h4>
            <p>Manage gallery uploads</p>
          </Link>
          <Link to="/admin/feedback" className="action-card">
            <span>📝</span>
            <h4>Feedback</h4>
            <p>View and respond to queries</p>
          </Link>
        </div>
      </div>
    </div>
  );
}