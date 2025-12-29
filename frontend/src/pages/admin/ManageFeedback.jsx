import { useEffect, useState } from "react";
import API from "../../api/api";
import Loader from "../../components/Loader";

export default function ManageFeedback() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [reply, setReply] = useState("");

  const loadFeedbacks = () => {
    setLoading(true);
    API.get("admin/feedback.php")
      .then(res => {
        if (Array.isArray(res.data)) {
          setFeedbacks(res.data);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadFeedbacks();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Delete this feedback?")) {
      try {
        await API.delete(`feedback/delete.php?id=${id}`);
        loadFeedbacks();
      } catch (error) {
        alert("Failed to delete");
      }
    }
  };

  const handleReply = async (e) => {
    e.preventDefault();
    try {
      await API.post("admin/reply-feedback.php", {
        id: selectedFeedback.id,
        reply: reply
      });
      setSelectedFeedback(null);
      setReply("");
      loadFeedbacks();
    } catch (error) {
      alert("Failed to send reply");
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="admin-page">
      <h1>📝 Manage Feedback</h1>

      {feedbacks.length === 0 ? (
        <p>No feedback found.</p>
      ) : (
        <div className="feedback-list">
          {feedbacks.map(fb => (
            <div key={fb.id} className={`feedback-card ${fb.status}`}>
              <div className="feedback-header">
                <span className="feedback-type">{fb.type}</span>
                <span className="feedback-date">{fb.created_at}</span>
              </div>
              <h4>{fb.name}</h4>
              <p className="email">{fb.email}</p>
              <p className="message">{fb.message}</p>
              
              {fb.reply && (
                <div className="admin-reply">
                  <strong>Your Reply:</strong>
                  <p>{fb.reply}</p>
                </div>
              )}

              <div className="feedback-actions">
                <button 
                  className="btn-primary" 
                  onClick={() => setSelectedFeedback(fb)}
                >
                  Reply
                </button>
                <button 
                  className="btn-delete" 
                  onClick={() => handleDelete(fb.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reply Modal */}
      {selectedFeedback && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Reply to {selectedFeedback.name}</h2>
            <p><strong>Original Message:</strong></p>
            <p>{selectedFeedback.message}</p>
            
            <form onSubmit={handleReply}>
              <div className="form-group">
                <label>Your Reply</label>
                <textarea
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  rows="4"
                  required
                ></textarea>
              </div>
              <div className="form-buttons">
                <button 
                  type="button" 
                  className="btn-secondary"
                  onClick={() => setSelectedFeedback(null)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Send Reply
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}