import { useEffect, useState } from "react";
import API from "../../api/api";
import Loader from "../../components/Loader";

export default function ManageCaseStudies() {
  const [caseStudies, setCaseStudies] = useState([]);
  const [filter, setFilter] = useState("pending");
  const [loading, setLoading] = useState(true);

  const loadCaseStudies = () => {
    setLoading(true);
    API.get(`admin/case-studies.php?status=${filter}`)
      .then(res => {
        if (Array.isArray(res.data)) {
          setCaseStudies(res.data);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadCaseStudies();
  }, [filter]);

  const handleApprove = async (id) => {
    try {
      await API.post("admin/approve-case-study.php", { id, status: "approved" });
      loadCaseStudies();
    } catch (error) {
      alert("Failed to approve");
    }
  };

  const handleReject = async (id) => {
    if (window.confirm("Reject this case study?")) {
      try {
        await API.post("admin/approve-case-study.php", { id, status: "rejected" });
        loadCaseStudies();
      } catch (error) {
        alert("Failed to reject");
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this case study?")) {
      try {
        await API.delete(`case_studies/delete.php?id=${id}`);
        loadCaseStudies();
      } catch (error) {
        alert("Failed to delete");
      }
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="admin-page">
      <h1>📄 Manage Case Studies</h1>

      <div className="filter-tabs">
        <button 
          className={filter === "pending" ? "active" : ""} 
          onClick={() => setFilter("pending")}
        >
          Pending
        </button>
        <button 
          className={filter === "approved" ? "active" : ""} 
          onClick={() => setFilter("approved")}
        >
          Approved
        </button>
        <button 
          className={filter === "rejected" ? "active" : ""} 
          onClick={() => setFilter("rejected")}
        >
          Rejected
        </button>
      </div>

      {caseStudies.length === 0 ? (
        <p>No case studies found.</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Plant</th>
              <th>PDF</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {caseStudies.map(cs => (
              <tr key={cs.id}>
                <td>{cs.title}</td>
                <td>{cs.author || "N/A"}</td>
                <td>{cs.plant_name || "N/A"}</td>
                <td>
                  {cs.pdf_path && (
                    <a
                      href={`https://hcctrichy.ac.in/phyto-drug-finder-main/backend/uploads/case_studies/${cs.pdf_path}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      View PDF
                    </a>
                  )}
                </td>
                <td className="actions">
                  {filter === "pending" && (
                    <>
                      <button className="btn-approve" onClick={() => handleApprove(cs.id)}>
                        ✓ Approve
                      </button>
                      <button className="btn-reject" onClick={() => handleReject(cs.id)}>
                        ✗ Reject
                      </button>
                    </>
                  )}
                  <button className="btn-delete" onClick={() => handleDelete(cs.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}