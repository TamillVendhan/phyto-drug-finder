import React, { useState } from "react";
import API from "../api/api";
import { Link } from "react-router-dom";


export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const search = async (q) => {
    setQuery(q);
    if (q.length < 2) {
      setResults([]);
      return;
    }

    const res = await API.get(`plants/search.php?q=${q}`);
    setResults(res.data);
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search plant name or scientific name"
        value={query}
        onChange={(e) => search(e.target.value)}
        style={{ width: "300px", padding: "8px" }}
      />

      <ul>
        {results.map((p) => (
          <li key={p.id}>
  <Link to={`/plant/${p.id}`}>
    {p.common_name} ({p.scientific_name})
  </Link>
</li>

        ))}
      </ul>
    </div>
  );
}
