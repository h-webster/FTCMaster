import { useState } from "react";
import { runSearch } from "../TeamSearch";
import './TeamSelectInput.css';

export default function TeamSelectInput({ value, onSelect, onClear, teamList }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [focused, setFocused] = useState(false);

  const handleChange = (e) => {
    const v = e.target.value;
    setQuery(v);
    const res = runSearch(v);
    setResults(res || []);
  };

  if (value !== null) {
    return (
      <div className="selected-team">
        <span>{value}</span>
        <button onClick={onClear}>✕</button>
      </div>
    );
  }

  return (
    <div className="input-container">
      <input
        type="text"
        value={query}
        autoComplete="off"
        onChange={handleChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />

      {focused && (
        <div className="search-results">
          {results.length === 0 ? (
            <div className="result">No results</div>
          ) : (
            results.map(team => (
              <div
                key={team.number}
                className="result"
                onMouseDown={() => {
                  onSelect(team.number);
                  setQuery("");
                }}
              >
                <h2 className="number">{team.number}</h2>
                <h2 className='name'>{team.name}</h2>
                <h2 className='location'>{team.location}</h2>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
