import { useMemo, useState } from "react";
import SkillCard from "../components/SkillCard";
import AddSkillModal from "../components/AddSkillModal";

function readChallengeSubmissions() {
  try {
    const saved = JSON.parse(
      localStorage.getItem("proofpath_challenge_submissions"),
    );

    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

function MySkills({ skills, setSkills }) {
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [submissions] = useState(readChallengeSubmissions);
  const evidenceCount = submissions.filter((submission) =>
    skills.some(
      (skill) =>
        skill.name.trim().toLowerCase() ===
        submission.skill.trim().toLowerCase(),
    ),
  ).length;

  const categories = ["All", ...new Set(skills.map((skill) => skill.category))];

  const filteredSkills = useMemo(() => {
    return skills.filter((skill) => {
      const matchesSearch = skill.name
        .toLowerCase()
        .includes(search.trim().toLowerCase());

      const matchesCategory =
        categoryFilter === "All" || skill.category === categoryFilter;

      return matchesSearch && matchesCategory;
    });
  }, [skills, search, categoryFilter]);

  function addSkill(newSkill) {
    setSkills((currentSkills) => {
      const alreadyExists = currentSkills.some(
        (skill) => skill.name.toLowerCase() === newSkill.name.toLowerCase(),
      );

      if (alreadyExists) {
        window.alert("This skill already exists in your list.");
        return currentSkills;
      }

      return [newSkill, ...currentSkills];
    });
  }

  function deleteSkill(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this skill?",
    );

    if (confirmed) {
      setSkills((currentSkills) =>
        currentSkills.filter((skill) => skill.id !== id),
      );
    }
  }

  return (
    <section className="pp-my-skills">
      <div className="pp-skills-heading">
        <div>
          <div className="section-kicker">YOUR DEVELOPMENT</div>
          <h1>
            My Skills<span>.</span>
          </h1>
          <p>
            Track what you are learning today. Build evidence to prove what you
            can do tomorrow.
          </p>
        </div>

        <button className="primary-button" onClick={() => setShowModal(true)}>
          + Add skill
        </button>
      </div>

      <div className="pp-skill-summary">
        <div>
          <span>Total skills</span>
          <strong>{skills.length}</strong>
        </div>
        <div>
          <span>Categories</span>
          <strong>{new Set(skills.map((skill) => skill.category)).size}</strong>
        </div>
        <div>
          <span>Evidence linked</span>
          <strong>{evidenceCount}</strong>
        </div>
      </div>

      <div className="pp-skills-toolbar">
        <div className="pp-skill-search">
          <span aria-hidden="true">⌕</span>
          <input
            type="search"
            placeholder="Search skills..."
            aria-label="Search skills"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <select
          className="form-select pp-filter-select"
          aria-label="Filter by category"
          value={categoryFilter}
          onChange={(event) => setCategoryFilter(event.target.value)}
        >
          {categories.map((category) => (
            <option key={category}>{category}</option>
          ))}
        </select>
      </div>

      {filteredSkills.length > 0 ? (
        <div className="pp-skills-grid">
          {filteredSkills.map((skill) => (
            <SkillCard key={skill.id} skill={skill} onDelete={deleteSkill} />
          ))}
        </div>
      ) : (
        <div className="pp-empty-skills">
          <div className="pp-empty-icon">◇</div>
          <h2>
            {skills.length === 0
              ? "Start your skill journey"
              : "No skills found"}
          </h2>
          <p>
            {skills.length === 0
              ? "Add your first skill to start building your ProofPath."
              : "Try another search term or select a different category."}
          </p>

          {skills.length === 0 && (
            <button
              className="primary-button"
              onClick={() => setShowModal(true)}
            >
              + Add your first skill
            </button>
          )}
        </div>
      )}

      {showModal && (
        <AddSkillModal onClose={() => setShowModal(false)} onAdd={addSkill} />
      )}
    </section>
  );
}

export default MySkills;
