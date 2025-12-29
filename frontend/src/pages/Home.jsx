import { useEffect, useState } from "react";
import SearchBar from "../components/SearchBar";
import Stats from "../components/Stats";
import PlantCard from "../components/PlantCard";
import Loader from "../components/Loader";
import API from "../api/api";

export default function Home() {
  const [featuredPlants, setFeaturedPlants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("plants/featured.php")
      .then(res => {
        if (Array.isArray(res.data)) {
          setFeaturedPlants(res.data);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <h1>🌿 Phyto Drug Finder</h1>
        <p className="tagline">
          Discover medicinal plants, bioactive compounds, and drug-likeness data
        </p>
        <SearchBar />
      </section>

      {/* Stats Section */}
      <section className="section">
        <Stats />
      </section>

      {/* Featured Plants */}
      <section className="section">
        <h2 className="section-title">Featured Plants</h2>
        {loading ? (
          <Loader />
        ) : (
          <div className="plants-grid">
            {featuredPlants.map(plant => (
              <PlantCard key={plant.id} plant={plant} />
            ))}
          </div>
        )}
      </section>

      {/* About Section */}
      <section className="section about-section">
        <h2 className="section-title">About This Project</h2>
        <div className="about-content">
          <p>
            Phyto Drug Finder is a comprehensive database for medicinal plants, 
            their bioactive compounds, and drug-likeness properties. This project 
            aims to bridge traditional knowledge with modern pharmaceutical research.
          </p>
          <div className="features-grid">
            <div className="feature">
              <span>🔬</span>
              <h4>Bioactive Compounds</h4>
              <p>Detailed compound information with chemical properties</p>
            </div>
            <div className="feature">
              <span>💊</span>
              <h4>Drug-Likeness</h4>
              <p>Lipinski rules and ADMET predictions</p>
            </div>
            <div className="feature">
              <span>📚</span>
              <h4>Case Studies</h4>
              <p>Research papers and clinical studies</p>
            </div>
            <div className="feature">
              <span>🌍</span>
              <h4>Traditional Knowledge</h4>
              <p>Ayurveda, Siddha, and folk medicine references</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}