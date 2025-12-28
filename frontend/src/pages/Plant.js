import React, { useEffect, useState } from "react";
import API from "../api/api";

export default function Plant() {
  const id = 1;

  const [plant, setPlant] = useState(null);
  const [tab, setTab] = useState("compounds");
  const [compounds, setCompounds] = useState([]);
  const [caseStudies, setCaseStudies] = useState([]);
  const [error, setError] = useState("");

  // ---------- LOAD PLANT ----------
  useEffect(() => {
    API.get(`plants/view.php?id=${id}`)
      .then(res => {
        if (res.data && !res.data.error) {
          setPlant(res.data);
        } else {
          setError("Plant not found");
        }
      })
      .catch(() => setError("Failed to load plant"));
  }, [id]);

  // ---------- LOAD TAB DATA ----------
  useEffect(() => {
    setError("");

    if (tab === "compounds") {
      API.get(`compounds/by-plant.php?plant_id=${id}`)
        .then(res => {
          // IMPORTANT SAFETY CHECK
          if (Array.isArray(res.data)) {
            setCompounds(res.data);
          } else {
            setCompounds([]);
          }
        })
        .catch(() => setCompounds([]));
    }

    if (tab === "cases") {
      API.get(`case_studies/list.php?plant_id=${id}`)
        .then(res => {
          if (Array.isArray(res.data)) {
            setCaseStudies(res.data);
          } else {
            setCaseStudies([]);
          }
        })
        .catch(() => setCaseStudies([]));
    }
  }, [tab, id]);

  // ---------- UI STATES ----------
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!plant) return <p>Loading plant...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>{plant.common_name}</h2>
      <i>{plant.scientific_name}</i>

      {/* TAB BUTTONS */}
      <div style={{ marginTop: "20px" }}>
        <button onClick={() => setTab("compounds")}>
          Bioactive Compounds
        </button>
        <button onClick={() => setTab("cases")}>
          Case Studies
        </button>
      </div>

      {/* TAB CONTENT */}
      <div style={{ marginTop: "20px" }}>
        {tab === "compounds" && (
          <div>
            <h3>Bioactive Compounds</h3>

            {compounds.length === 0 ? (
              <p>No compounds found.</p>
            ) : (
              <ul>
                {compounds.map(c => (
                  <li key={c.id}>
                    <b>{c.compound_name}</b> — {c.chemical_class}
                    <br />
                    <small>{c.activity}</small>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {tab === "cases" && (
          <div>
            <h3>Case Studies</h3>

            {caseStudies.length === 0 ? (
              <p>No case studies available.</p>
            ) : (
              <ul>
                {caseStudies.map((cs, i) => (
                  <li key={i}>
                    <b>{cs.title}</b>
                    <p>{cs.abstract}</p>

                    {cs.pdf_path && (
                      <a
                        href={`http://localhost/phyto-drug-finder/backend/uploads/case_studies/${cs.pdf_path}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        View PDF
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
