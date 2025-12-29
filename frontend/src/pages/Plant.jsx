import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/api";
import AudioButton from "../components/AudioButton";
import Loader from "../components/Loader";

export default function Plant() {
  const { id } = useParams();
  const [plant, setPlant] = useState(null);
  const [activeTab, setActiveTab] = useState("compounds");
  const [tabData, setTabData] = useState({});
  const [loading, setLoading] = useState(true);
  const [tabLoading, setTabLoading] = useState(false);
  const [error, setError] = useState("");

  // Load Plant Details
  useEffect(() => {
    setLoading(true);
    API.get(`plants/view.php?id=${id}`)
      .then(res => {
        if (res.data && !res.data.error) {
          setPlant(res.data);
        } else {
          setError("Plant not found");
        }
      })
      .catch(() => setError("Failed to load plant"))
      .finally(() => setLoading(false));
  }, [id]);

  // Load Tab Data
  useEffect(() => {
    if (!plant) return;

    setTabLoading(true);
    let endpoint = "";

    switch (activeTab) {
      case "compounds":
        endpoint = `compounds/by-plant.php?plant_id=${id}`;
        break;
      case "similar":
        endpoint = `compounds/similar.php?plant_id=${id}`;
        break;
      case "medicinal":
        endpoint = `plants/medicinal-uses.php?plant_id=${id}`;
        break;
      case "safety":
        endpoint = `plants/safety.php?plant_id=${id}`;
        break;
      case "druglikeness":
        endpoint = `plants/drug-likeness.php?plant_id=${id}`;
        break;
      case "ecology":
        endpoint = `plants/ecology.php?plant_id=${id}`;
        break;
      case "cultural":
        endpoint = `plants/cultural.php?plant_id=${id}`;
        break;
      case "cases":
        endpoint = `case_studies/list.php?plant_id=${id}`;
        break;
      default:
        setTabLoading(false);
        return;
    }

    API.get(endpoint)
      .then(res => {
        setTabData(prev => ({
          ...prev,
          [activeTab]: res.data
        }));
      })
      .catch(console.error)
      .finally(() => setTabLoading(false));
  }, [activeTab, id, plant]);

  if (loading) return <Loader />;
  if (error) return <div className="error-message">{error}</div>;
  if (!plant) return null;

  const tabs = [
    { key: "compounds", label: "Bioactive Compounds", icon: "🧪" },
    { key: "similar", label: "Similar Compounds", icon: "🔗" },
    { key: "medicinal", label: "Medicinal Uses", icon: "💊" },
    { key: "safety", label: "Safety Summary", icon: "⚠️" },
    { key: "druglikeness", label: "Drug-Likeness", icon: "📊" },
    { key: "ecology", label: "Growth & Ecology", icon: "🌱" },
    { key: "cultural", label: "Cultural & Historical", icon: "📜" },
    { key: "cases", label: "Case Studies", icon: "📄" }
  ];

  return (
    <div className="plant-page">
      {/* Plant Header */}
      <section className="plant-header">
        <div className="plant-header-content">
          <div className="plant-info">
            <h1>{plant.common_name}</h1>
            <p className="scientific-name"><i>{plant.scientific_name}</i></p>

            {/* Audio Pronunciation */}
            <div className="audio-buttons">
              <AudioButton text={plant.common_name} label="Common Name" />
              <AudioButton text={plant.scientific_name} label="Scientific Name" />
            </div>

            {/* Botanical Classification */}
            <div className="classification">
              <h3>Botanical Classification</h3>
              <table>
                <tbody>
                  <tr><td>Kingdom</td><td>{plant.kingdom || "Plantae"}</td></tr>
                  <tr><td>Family</td><td>{plant.family || "N/A"}</td></tr>
                  <tr><td>Genus</td><td>{plant.genus || "N/A"}</td></tr>
                  <tr><td>Species</td><td>{plant.species || "N/A"}</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          {plant.image_url && (
            <div className="plant-image">
              <img 
                src={`https://hcctrichy.ac.in/phyto-drug-finder-main/backend/uploads/plants/${plant.image_url}`}
                alt={plant.common_name}
              />
            </div>
          )}
        </div>
      </section>

      {/* Tab Navigation */}
      <section className="tabs-section">
        <div className="tabs-nav">
          {tabs.map(tab => (
            <button
              key={tab.key}
              className={`tab-btn ${activeTab === tab.key ? "active" : ""}`}
              onClick={() => setActiveTab(tab.key)}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span className="tab-label">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {tabLoading ? (
            <Loader />
          ) : (
            <>
              {/* Compounds Tab */}
              {activeTab === "compounds" && (
                <CompoundsTab data={tabData.compounds} />
              )}

              {/* Similar Compounds Tab */}
              {activeTab === "similar" && (
                <SimilarCompoundsTab data={tabData.similar} />
              )}

              {/* Medicinal Uses Tab */}
              {activeTab === "medicinal" && (
                <MedicinalTab data={tabData.medicinal} />
              )}

              {/* Safety Tab */}
              {activeTab === "safety" && (
                <SafetyTab data={tabData.safety} />
              )}

              {/* Drug-Likeness Tab */}
              {activeTab === "druglikeness" && (
                <DrugLikenessTab data={tabData.druglikeness} />
              )}

              {/* Ecology Tab */}
              {activeTab === "ecology" && (
                <EcologyTab data={tabData.ecology} />
              )}

              {/* Cultural Tab */}
              {activeTab === "cultural" && (
                <CulturalTab data={tabData.cultural} />
              )}

              {/* Case Studies Tab */}
              {activeTab === "cases" && (
                <CaseStudiesTab data={tabData.cases} />
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}

// ============ TAB COMPONENTS ============

function CompoundsTab({ data }) {
  const compounds = Array.isArray(data) ? data : [];

  if (compounds.length === 0) {
    return <p className="no-data">No bioactive compounds found.</p>;
  }

  return (
    <div className="compounds-tab">
      <h3>Bioactive Compounds</h3>
      <div className="compounds-grid">
        {compounds.map((c, i) => (
          <div key={i} className="compound-card">
            <h4>{c.compound_name}</h4>
            <p><strong>Class:</strong> {c.chemical_class || "N/A"}</p>
            {c.molecular_formula && (
              <p><strong>Formula:</strong> {c.molecular_formula}</p>
            )}
            <p><strong>Activity:</strong> {c.activity || "N/A"}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function SimilarCompoundsTab({ data }) {
  const similar = Array.isArray(data) ? data : [];

  if (similar.length === 0) {
    return <p className="no-data">No similar compounds found.</p>;
  }

  return (
    <div className="similar-tab">
      <h3>Similar Natural Compounds</h3>
      <table className="data-table">
        <thead>
          <tr>
            <th>Compound</th>
            <th>Found In</th>
            <th>Similar Activity</th>
          </tr>
        </thead>
        <tbody>
          {similar.map((s, i) => (
            <tr key={i}>
              <td>{s.compound_name}</td>
              <td>{s.found_in}</td>
              <td>{s.activity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function MedicinalTab({ data }) {
  const uses = data || {};

  return (
    <div className="medicinal-tab">
      <h3>Medicinal Uses</h3>
      
      <div className="use-section">
        <h4>🏛️ Traditional Use</h4>
        <p>{uses.traditional_use || "No data available"}</p>
      </div>

      <div className="use-section">
        <h4>🔬 Modern Research Use</h4>
        <p>{uses.modern_use || "No data available"}</p>
      </div>

      <div className="evidence-level">
        <h4>Evidence Level</h4>
        <div className="evidence-badges">
          <span className={`badge ${uses.evidence_traditional ? "active" : ""}`}>
            Traditional
          </span>
          <span className={`badge ${uses.evidence_experimental ? "active" : ""}`}>
            Experimental
          </span>
          <span className={`badge ${uses.evidence_clinical ? "active" : ""}`}>
            Clinical
          </span>
        </div>
      </div>

      <div className="disclaimer">
        ⚠️ <strong>Disclaimer:</strong> This information is for educational purposes only. 
        Not a medical prescription. Consult a healthcare professional.
      </div>
    </div>
  );
}

function SafetyTab({ data }) {
  const safety = data || {};

  return (
    <div className="safety-tab">
      <h3>Safety Summary</h3>

      <div className="safety-grid">
        <div className="safety-item">
          <span className="safety-icon">👤</span>
          <h4>Safe for Humans</h4>
          <span className={`safety-badge ${safety.human_safe}`}>
            {safety.human_safe || "Unknown"}
          </span>
        </div>

        <div className="safety-item">
          <span className="safety-icon">🐄</span>
          <h4>Safe for Animals</h4>
          <span className={`safety-badge ${safety.animal_safe}`}>
            {safety.animal_safe || "Unknown"}
          </span>
        </div>

        <div className="safety-item">
          <span className="safety-icon">⚠️</span>
          <h4>Toxic Dosage</h4>
          <p>{safety.toxic_dosage || "Not specified"}</p>
        </div>

        <div className="safety-item">
          <span className="safety-icon">🤰</span>
          <h4>Pregnancy Warning</h4>
          <p>{safety.pregnancy_warning || "Consult doctor before use"}</p>
        </div>
      </div>
    </div>
  );
}

function DrugLikenessTab({ data }) {
  const drugData = data || {};

  return (
    <div className="druglikeness-tab">
      <h3>Drug-Likeness Properties</h3>

      <div className="lipinski-section">
        <h4>Lipinski's Rule of Five</h4>
        <div className="lipinski-grid">
          <div className="lipinski-item">
            <span className="label">Molecular Weight</span>
            <span className="value">{drugData.molecular_weight || "N/A"}</span>
            <span className="rule">{"< 500 Da"}</span>
          </div>
          <div className="lipinski-item">
            <span className="label">H-Bond Donors</span>
            <span className="value">{drugData.hbd || "N/A"}</span>
            <span className="rule">{"≤ 5"}</span>
          </div>
          <div className="lipinski-item">
            <span className="label">H-Bond Acceptors</span>
            <span className="value">{drugData.hba || "N/A"}</span>
            <span className="rule">{"≤ 10"}</span>
          </div>
          <div className="lipinski-item">
            <span className="label">LogP</span>
            <span className="value">{drugData.logp || "N/A"}</span>
            <span className="rule">{"≤ 5"}</span>
          </div>
        </div>
      </div>

      <div className="admet-section">
        <h4>ADMET Properties</h4>
        <table className="data-table">
          <tbody>
            <tr>
              <td>Absorption</td>
              <td>
                <span className={`admet-badge ${drugData.absorption?.toLowerCase()}`}>
                  {drugData.absorption || "N/A"}
                </span>
              </td>
            </tr>
            <tr>
              <td>Distribution</td>
              <td>{drugData.distribution || "N/A"}</td>
            </tr>
            <tr>
              <td>Metabolism</td>
              <td>{drugData.metabolism || "N/A"}</td>
            </tr>
            <tr>
              <td>Excretion</td>
              <td>{drugData.excretion || "N/A"}</td>
            </tr>
            <tr>
              <td>Toxicity Risk</td>
              <td>
                <span className={`toxicity-badge ${drugData.toxicity_risk ? "yes" : "no"}`}>
                  {drugData.toxicity_risk ? "Yes" : "No"}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function EcologyTab({ data }) {
  const ecology = data || {};

  return (
    <div className="ecology-tab">
      <h3>Growth & Ecology</h3>

      <div className="ecology-grid">
        <div className="ecology-item">
          <h4>🌱 Growth Stages</h4>
          <p>{ecology.growth_stages || "N/A"}</p>
        </div>
        <div className="ecology-item">
          <h4>📅 Best Season</h4>
          <p>{ecology.best_season || "N/A"}</p>
        </div>
        <div className="ecology-item">
          <h4>🪨 Soil Type</h4>
          <p>{ecology.soil_type || "N/A"}</p>
        </div>
        <div className="ecology-item">
          <h4>🌡️ Climate</h4>
          <p>{ecology.climate || "N/A"}</p>
        </div>
        <div className="ecology-item full-width">
          <h4>🌍 Regions of Growth</h4>
          <p>{ecology.regions || "N/A"}</p>
        </div>
      </div>
    </div>
  );
}

function CulturalTab({ data }) {
  const cultural = data || {};

  return (
    <div className="cultural-tab">
      <h3>Cultural & Historical Use</h3>

      <div className="cultural-grid">
        <div className="cultural-item">
          <h4>🕉️ Ayurveda</h4>
          <p>{cultural.ayurveda || "No documented use"}</p>
        </div>
        <div className="cultural-item">
          <h4>🔱 Siddha</h4>
          <p>{cultural.siddha || "No documented use"}</p>
        </div>
        <div className="cultural-item">
          <h4>🏡 Folk Medicine</h4>
          <p>{cultural.folk_medicine || "No documented use"}</p>
        </div>
        <div className="cultural-item">
          <h4>📚 Historical References</h4>
          <p>{cultural.historical_references || "No references available"}</p>
        </div>
      </div>
    </div>
  );
}

function CaseStudiesTab({ data }) {
  const cases = Array.isArray(data) ? data : [];

  if (cases.length === 0) {
    return <p className="no-data">No case studies available for this plant.</p>;
  }

  return (
    <div className="cases-tab">
      <h3>Case Studies</h3>

      <div className="cases-list">
        {cases.map((cs, i) => (
          <div key={i} className="case-card">
            <h4>{cs.title}</h4>
            {cs.author && <p className="author">By: {cs.author}</p>}
            {cs.institution && <p className="institution">{cs.institution}</p>}
            <p className="abstract">{cs.abstract}</p>
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
    </div>
  );
}