import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/api";
import Loader from "../components/Loader";
import { useAuth } from "../context/AuthContext";

export default function CaseStudies() {
  const [caseStudies, setCaseStudies] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    API.get("case_studies/list.php")
      .then(res => {
        if (Array.isArray(res.data)) {
          setCaseStudies(res.data);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="case-studies-page">
      <div className="page-header">
        <h1>📄 Case Studies</h1>
        <p>Research papers and clinical studies on medicinal plants</p>
        {user && (
          <Link to="/add-case-study" className="btn-primary">
            + Add Case Study
          </Link>
        )}
      </div>

      {caseStudies.length === 0 ? (
        <p className="no-data">No case studies available yet.</p>
      ) : (
        <div className="cases-grid">
          {caseStudies.map((cs, i) => (
            <div key={i} className="case-card">
              <h3>{cs.title}</h3>
              <p className="meta">
                {cs.author && <span>By: {cs.author}</span>}
                {cs.institution && <span> | {cs.institution}</span>}
              </p>
              <p className="abstract">{cs.abstract}</p>
              {cs.plant_name && (
                <p className="related-plant">
                  Related Plant: <Link to={`/plant/${cs.plant_id}`}>{cs.plant_name}</Link>
                </p>
              )}
              {cs.pdf_path && (
                <a
                  href={`https://hcctrichy.ac.in/phyto-drug-finder-main/backend/uploads/case_studies/${cs.pdf_path}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-pdf"
                >
                  📄 View PDF
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}