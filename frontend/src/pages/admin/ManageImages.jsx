import { useEffect, useState } from "react";
import API from "../../api/api";
import Loader from "../../components/Loader";

export default function ManageImages() {
  const [images, setImages] = useState([]);
  const [filter, setFilter] = useState("pending");
  const [loading, setLoading] = useState(true);

  const loadImages = () => {
    setLoading(true);
    API.get(`admin/images.php?status=${filter}`)
      .then(res => {
        if (Array.isArray(res.data)) {
          setImages(res.data);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadImages();
  }, [filter]);

  const handleApprove = async (id) => {
    try {
      await API.post("admin/approve-image.php", { id, status: "approved" });
      loadImages();
    } catch (error) {
      alert("Failed to approve");
    }
  };

  const handleReject = async (id) => {
    try {
      await API.post("admin/approve-image.php", { id, status: "rejected" });
      loadImages();
    } catch (error) {
      alert("Failed to reject");
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="admin-page">
      <h1>🖼️ Manage Images</h1>

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
      </div>

      {images.length === 0 ? (
        <p>No images found.</p>
      ) : (
        <div className="admin-images-grid">
          {images.map(img => (
            <div key={img.id} className="admin-image-card">
              <img
                src={`https://hcctrichy.ac.in/phyto-drug-finder-main/backend/uploads/images/${img.file_path}`}
                alt={img.caption}
              />
              <div className="image-info">
                <p>{img.caption}</p>
                <small>{img.category}</small>
              </div>
              <div className="image-actions">
                {filter === "pending" && (
                  <>
                    <button className="btn-approve" onClick={() => handleApprove(img.id)}>
                      ✓ Approve
                    </button>
                    <button className="btn-reject" onClick={() => handleReject(img.id)}>
                      ✗ Reject
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}