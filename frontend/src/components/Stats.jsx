import { useEffect, useState } from "react";
import API from "../api/api";

export default function Stats() {
  const [stats, setStats] = useState({
    plants: 0,
    compounds: 0,
    caseStudies: 0
  });

  useEffect(() => {
    API.get("stats/index.php")
      .then(res => {
        if (res.data) {
          setStats(res.data);
        }
      })
      .catch(console.error);
  }, []);

  return (
    <div className="stats-container">
      <div className="stat-card">
        <span className="stat-icon">🌿</span>
        <h3>{stats.plants}</h3>
        <p>Total Plants</p>
      </div>
      <div className="stat-card">
        <span className="stat-icon">🧪</span>
        <h3>{stats.compounds}</h3>
        <p>Compounds</p>
      </div>
      <div className="stat-card">
        <span className="stat-icon">📄</span>
        <h3>{stats.caseStudies}</h3>
        <p>Case Studies</p>
      </div>
    </div>
  );
}