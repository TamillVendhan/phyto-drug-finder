import { Link } from "react-router-dom";

export default function PlantCard({ plant }) {
  const imageUrl = plant.image_url 
    ? `https://hcctrichy.ac.in/phyto-drug-finder-main/backend/uploads/plants/${plant.image_url}`
    : "/placeholder-plant.jpg";

  return (
    <div className="plant-card">
      <div className="plant-card-image">
        <img src={imageUrl} alt={plant.common_name} />
      </div>
      <div className="plant-card-content">
        <h3>{plant.common_name}</h3>
        <p className="scientific-name"><i>{plant.scientific_name}</i></p>
        <p className="family">Family: {plant.family || "N/A"}</p>
        <Link to={`/plant/${plant.id}`} className="btn-view">
          View Details →
        </Link>
      </div>
    </div>
  );
}