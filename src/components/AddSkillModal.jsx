
import { useState } from "react";

function AddSkillModal({ onClose, onAdd }) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Frontend");
  const [level, setLevel] = useState("Beginner");
  const [error, setError] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    const trimmedName = name.trim();

    if (!trimmedName) {
      setError("Please enter a skill name.");
      return;
    }

    onAdd({
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name: trimmedName,
      category,
      level,
      createdAt: new Date().toISOString(),
    });

    onClose();
  }

  return (
    <div
      className="pp-modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        className="pp-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-skill-title"
      >
        <div className="pp-modal-heading">
          <div>
            <span className="section-kicker">SKILL LIBRARY</span>
            <h2 id="add-skill-title">Add a new skill</h2>
            <p>Start tracking a skill you are learning.</p>
          </div>

          <button
            type="button"
            className="pp-delete-button"
            onClick={onClose}
            aria-label="Close form"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <label className="pp-form-label" htmlFor="skill-name">
            Skill name
          </label>
          <input
            id="skill-name"
            className="form-control pp-form-control"
            placeholder="e.g. JavaScript"
            value={name}
            maxLength={50}
            onChange={(event) => {
              setName(event.target.value);
              setError("");
            }}
            autoFocus
          />

          <label className="pp-form-label" htmlFor="skill-category">
            Category
          </label>
          <select
            id="skill-category"
            className="form-select pp-form-control"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          >
            <option>Frontend</option>
            <option>Backend</option>
            <option>Programming</option>
            <option>Database</option>
            <option>AI & Machine Learning</option>
            <option>Cybersecurity</option>
            <option>Tools & Platforms</option>
            <option>Other</option>
          </select>

          <label className="pp-form-label" htmlFor="skill-level">
            Current proficiency
          </label>
          <select
            id="skill-level"
            className="form-select pp-form-control"
            value={level}
            onChange={(event) => setLevel(event.target.value)}
          >
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
            <option>Expert</option>
          </select>

          {error && <p className="pp-form-error">{error}</p>}

          <div className="pp-modal-actions">
            <button
              type="button"
              className="pp-secondary-button"
              onClick={onClose}
            >
              Cancel
            </button>
            <button type="submit" className="primary-button">
              + Add skill
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default AddSkillModal;
