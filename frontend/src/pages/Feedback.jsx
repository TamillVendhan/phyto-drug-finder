import { useState } from "react";
import API from "../api/api";

export default function Feedback() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    type: "question",
    message: ""
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  const feedbackTypes = [
    { value: "question", label: "Question about plant" },
    { value: "correction", label: "Correction request" },
    { value: "collaboration", label: "Collaboration request" },
    { value: "bug", label: "Bug report" },
    { value: "other", label: "Other" }
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: "", message: "" });

    try {
      const res = await API.post("feedback/submit.php", formData);
      if (res.data.success) {
        setStatus({ type: "success", message: "Thank you! Your feedback has been submitted." });
        setFormData({ name: "", email: "", type: "question", message: "" });
      } else {
        setStatus({ type: "error", message: res.data.message || "Failed to submit feedback" });
      }
    } catch (error) {
      setStatus({ type: "error", message: "Failed to submit feedback" });
    }
    setLoading(false);
  };

  return (
    <div className="feedback-page">
      <h1>📝 Feedback & Queries</h1>
      <p>We value your input! Send us your questions, corrections, or collaboration requests.</p>

      <form onSubmit={handleSubmit} className="form feedback-form">
        {status.message && (
          <div className={`alert ${status.type}`}>{status.message}</div>
        )}

        <div className="form-row">
          <div className="form-group">
            <label>Your Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter your name"
            />
          </div>

          <div className="form-group">
            <label>Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="your@email.com"
            />
          </div>
        </div>

        <div className="form-group">
          <label>Feedback Type *</label>
          <select name="type" value={formData.type} onChange={handleChange}>
            {feedbackTypes.map(t => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Message *</label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            rows="6"
            placeholder="Write your message here..."
          ></textarea>
        </div>

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? "Submitting..." : "Submit Feedback"}
        </button>
      </form>
    </div>
  );
}