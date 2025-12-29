import { useEffect, useState } from "react";
import API from "../../api/api";
import Loader from "../../components/Loader";

export default function ManagePlants() {
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPlant, setEditingPlant] = useState(null);

  const loadPlants = () => {
    setLoading(true);
    API.get("plants/list.php")
      .then(res => {
        if (Array.isArray(res.data)) {
          setPlants(res.data);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadPlants();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this plant?")) {
      try {
        await API.delete(`plants/delete.php?id=${id}`);
        loadPlants();
      } catch (error) {
        alert("Failed to delete plant");
      }
    }
  };

  const handleEdit = (plant) => {
    setEditingPlant(plant);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingPlant(null);
    loadPlants();
  };

  if (loading) return <Loader />;

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>🌿 Manage Plants</h1>
        <button className="btn-primary" onClick={() => setShowForm(true)}>
          + Add Plant
        </button>
      </div>

      {showForm && (
        <PlantForm plant={editingPlant} onClose={handleFormClose} />
      )}

      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Common Name</th>
            <th>Scientific Name</th>
            <th>Family</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {plants.map(plant => (
            <tr key={plant.id}>
              <td>{plant.id}</td>
              <td>{plant.common_name}</td>
              <td><i>{plant.scientific_name}</i></td>
              <td>{plant.family || "N/A"}</td>
              <td className="actions">
                <button className="btn-edit" onClick={() => handleEdit(plant)}>
                  Edit
                </button>
                <button className="btn-delete" onClick={() => handleDelete(plant.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PlantForm({ plant, onClose }) {
  const [formData, setFormData] = useState({
    common_name: plant?.common_name || "",
    scientific_name: plant?.scientific_name || "",
    kingdom: plant?.kingdom || "Plantae",
    family: plant?.family || "",
    genus: plant?.genus || "",
    species: plant?.species || ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const endpoint = plant 
        ? "plants/update.php" 
        : "plants/add.php";
      
      const data = plant 
        ? { ...formData, id: plant.id }
        : formData;

      const res = await API.post(endpoint, data);
      
      if (res.data.success) {
        onClose();
      } else {
        setError(res.data.message || "Failed to save plant");
      }
    } catch (err) {
      setError("Failed to save plant");
    }
    setLoading(false);
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>{plant ? "Edit Plant" : "Add New Plant"}</h2>
        
        <form onSubmit={handleSubmit}>
          {error && <div className="alert error">{error}</div>}

          <div className="form-group">
            <label>Common Name *</label>
            <input
              type="text"
              name="common_name"
              value={formData.common_name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Scientific Name *</label>
            <input
              type="text"
              name="scientific_name"
              value={formData.scientific_name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Kingdom</label>
              <input
                type="text"
                name="kingdom"
                value={formData.kingdom}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Family</label>
              <input
                type="text"
                name="family"
                value={formData.family}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Genus</label>
              <input
                type="text"
                name="genus"
                value={formData.genus}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Species</label>
              <input
                type="text"
                name="species"
                value={formData.species}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-buttons">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Saving..." : "Save Plant"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}