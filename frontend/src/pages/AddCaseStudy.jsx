import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import { useAuth } from "../context/AuthContext";

export default function AddCaseStudy() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [plants, setPlants] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    institution: "",
    abstract: "",
    plant_id: "",
    declaration: false
  });
  const [pdfFile, setPdfFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Load plants for dropdown
  useEffect(() => {
    API.get("plants/list.php")
      .then(res => {
        if (Array.isArray(res.data)) {
          setPlants(res.data);
        }
      })
      .catch(console.error);
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setPdfFile(file);
    } else {
      setError("Please select a PDF file");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.declaration) {
      setError("Please confirm that this is your original work");
      return;
    }

    if (!pdfFile) {
      setError("Please upload a PDF file");
      return;
    }

    setLoading(true);

    const submitData = new FormData();
    submitData.append("title", formData.title);
    submitData.append("author", formData.author);
    submitData.append("institution", formData.institution);
    submitData.append("abstract", formData.abstract);
    submitData.append("plant_id", formData.plant_id);
    submitData.append("user_id", user.id);
    submitData.append("pdf", pdfFile);

    try {
      const res = await API.post("case_studies/add.php", submitData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      if (res.data.success) {
        setSuccess("Case study submitted successfully! Awaiting admin approval.");
        setTimeout(() => navigate("/case-studies"), 2000);
      } else {
        setError(res.data.message || "Failed to submit case study");
      }
    } catch (err) {
      setError("Failed to submit case study");
    }

    setLoading(false);
  };

  return (
    <div className="add-case-study-page">
      <h1>📤 Add Case Study</h1>
      <p>Submit your research paper or case study for review</p>

      <form onSubmit={handleSubmit} className="form">
        {error && <div className="alert error">{error}</div>}
        {success && <div className="alert success">{success}</div>}

        <div className="form-group">
          <label>Title *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="Enter case study title"
          />
        </div>

        <div className="form-group">
          <label>Author Name</label>
          <input
            type="text"
            name="author"
            value={formData.author}
            onChange={handleChange}
            placeholder="Your name"
          />
        </div>

        <div className="form-group">
          <label>Institution</label>
          <input
            type="text"
            name="institution"
            value={formData.institution}
            onChange={handleChange}
            placeholder="University or Organization"
          />
        </div>

        <div className="form-group">
          <label>Related Plant *</label>
          <select
            name="plant_id"
            value={formData.plant_id}
            onChange={handleChange}
            required
          >
            <option value="">Select a plant</option>
            {plants.map(p => (
              <option key={p.id} value={p.id}>
                {p.common_name} ({p.scientific_name})
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Abstract *</label>
          <textarea
            name="abstract"
            value={formData.abstract}
            onChange={handleChange}
            required
            rows="5"
            placeholder="Brief summary of your case study"
          ></textarea>
        </div>

        <div className="form-group">
          <label>Upload PDF *</label>
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            required
          />
        </div>

        <div className="form-group checkbox">
          <label>
            <input
              type="checkbox"
              name="declaration"
              checked={formData.declaration}
              onChange={handleChange}
            />
            I declare that this is my original work and I have the right to submit it.
          </label>
        </div>

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? "Submitting..." : "Submit Case Study"}
        </button>

        <p className="note">
          ⚠️ Your submission will be reviewed by admin before publishing.
        </p>
      </form>
    </div>
  );
}