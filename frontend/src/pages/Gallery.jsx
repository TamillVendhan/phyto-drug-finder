import { useEffect, useState } from "react";
import API from "../api/api";
import Loader from "../components/Loader";
import { useAuth } from "../context/AuthContext";

export default function Gallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("all");
  const [showUpload, setShowUpload] = useState(false);
  const { user } = useAuth();

  const categories = [
    { key: "all", label: "All" },
    { key: "plant_photos", label: "Plant Photos" },
    { key: "microscopic", label: "Microscopic" },
    { key: "traditional_art", label: "Traditional Artwork" },
    { key: "herbarium", label: "Herbarium Sheets" }
  ];

  useEffect(() => {
    setLoading(true);
    const endpoint = category === "all" 
      ? "images/list.php" 
      : `images/list.php?category=${category}`;

    API.get(endpoint)
      .then(res => {
        if (Array.isArray(res.data)) {
          setImages(res.data);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [category]);

  return (
    <div className="gallery-page">
      <div className="page-header">
        <h1>🖼️ Gallery</h1>
        <p>Photos, microscopic images, and traditional artworks</p>
        {user && (
          <button 
            className="btn-primary"
            onClick={() => setShowUpload(!showUpload)}
          >
            {showUpload ? "Close Upload" : "+ Upload Image"}
          </button>
        )}
      </div>

      {showUpload && <UploadForm onSuccess={() => {
        setShowUpload(false);
        setCategory(category); // Refresh
      }} />}

      {/* Category Filter */}
      <div className="category-filter">
        {categories.map(cat => (
          <button
            key={cat.key}
            className={`filter-btn ${category === cat.key ? "active" : ""}`}
            onClick={() => setCategory(cat.key)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {loading ? (
        <Loader />
      ) : images.length === 0 ? (
        <p className="no-data">No images found.</p>
      ) : (
        <div className="gallery-grid">
          {images.map((img, i) => (
            <div key={i} className="gallery-item">
              <img
                src={`https://hcctrichy.ac.in/phyto-drug-finder-main/backend/uploads/images/${img.file_path}`}
                alt={img.caption}
              />
              <div className="gallery-caption">
                <p>{img.caption}</p>
                {img.credit && <small>Credit: {img.credit}</small>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function UploadForm({ onSuccess }) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    caption: "",
    category: "plant_photos",
    credit: ""
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage({ type: "error", text: "Please select an image" });
      return;
    }

    setLoading(true);
    const data = new FormData();
    data.append("image", file);
    data.append("caption", formData.caption);
    data.append("category", formData.category);
    data.append("credit", formData.credit);
    data.append("user_id", user.id);

    try {
      const res = await API.post("images/upload.php", data, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      if (res.data.success) {
        setMessage({ type: "success", text: "Image uploaded! Awaiting approval." });
        setTimeout(onSuccess, 1500);
      } else {
        setMessage({ type: "error", text: res.data.message || "Upload failed" });
      }
    } catch (err) {
      setMessage({ type: "error", text: "Upload failed" });
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="upload-form">
      {message.text && (
        <div className={`alert ${message.type}`}>{message.text}</div>
      )}

      <div className="form-row">
        <div className="form-group">
          <label>Image (JPG/PNG) *</label>
          <input
            type="file"
            accept="image/jpeg,image/png"
            onChange={(e) => setFile(e.target.files[0])}
            required
          />
        </div>

        <div className="form-group">
          <label>Category *</label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          >
            <option value="plant_photos">Plant Photos</option>
            <option value="microscopic">Microscopic</option>
            <option value="traditional_art">Traditional Artwork</option>
            <option value="herbarium">Herbarium Sheets</option>
          </select>
        </div>
      </div>

      <div className="form-group">
        <label>Caption *</label>
        <input
          type="text"
          value={formData.caption}
          onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
          required
          placeholder="Describe the image"
        />
      </div>

      <div className="form-group">
        <label>Credit/Source</label>
        <input
          type="text"
          value={formData.credit}
          onChange={(e) => setFormData({ ...formData, credit: e.target.value })}
          placeholder="Photo credit or source"
        />
      </div>

      <button type="submit" className="btn-primary" disabled={loading}>
        {loading ? "Uploading..." : "Upload Image"}
      </button>
    </form>
  );
}