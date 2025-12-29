import { useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/api";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const search = async (q) => {
    setQuery(q);
    if (q.length < 2) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const res = await API.get(`plants/search.php?q=${q}`);
      setResults(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      setResults([]);
    }
    setLoading(false);
  };

  return (
    <div className="search-container">
      <div className="search-box">
        <input
          type="text"
          placeholder="🔍 Search plant name or scientific name..."
          value={query}
          onChange={(e) => search(e.target.value)}
          className="search-input"
        />
        {loading && <span className="search-loader">⏳</span>}
      </div>

      {results.length > 0 && (
        <ul className="search-results">
          {results.map((p) => (
            <li key={p.id}>
              <Link to={`/plant/${p.id}`} onClick={() => setQuery("")}>
                <strong>{p.common_name}</strong>
                <span className="scientific">({p.scientific_name})</span>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {query.length >= 2 && results.length === 0 && !loading && (
        <p className="no-results">No plants found for "{query}"</p>
      )}
    </div>
  );
}