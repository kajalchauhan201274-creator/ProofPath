
import { useState } from "react";

function readSubmissions() {
  try {
    const saved = JSON.parse(
      localStorage.getItem("proofpath_challenge_submissions")
    );
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

function SkillCard({ skill, onDelete }) {
  const [showEvidence, setShowEvidence] = useState(false);
  const submissions = readSubmissions();

  const relatedSubmissions = submissions.filter(
    (submission) =>
      submission.skill?.trim().toLowerCase() ===
      skill.name.trim().toLowerCase()
  );

  const levels = {
    Beginner: 25,
    Intermediate: 50,
    Advanced: 75,
    Expert: 100,
  };

  const progress = levels[skill.level] ?? 25;

  return (
    <article className="pp-skill-card">
      <div className="pp-skill-card-top">
        <div className="pp-skill-avatar">
          {skill.name.charAt(0).toUpperCase()}
        </div>

        <button
          type="button"
          className="pp-delete-button"
          onClick={() => onDelete(skill.id)}
          aria-label={`Delete ${skill.name}`}
          title="Delete skill"
        >
          <span aria-hidden="true">×</span>
        </button>
      </div>

      <span className="pp-category">{skill.category}</span>
      <h3>{skill.name}</h3>

      <div className="pp-level-row">
        <span>Proficiency</span>
        <strong>{skill.level}</strong>
      </div>

      <div
        className="progress pp-skill-progress"
        role="progressbar"
        aria-label={`${skill.name} proficiency`}
        aria-valuenow={progress}
        aria-valuemin="0"
        aria-valuemax="100"
      >
        <div
          className="progress-bar"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="pp-skill-card-footer">
        <span>{progress}% progress indicator</span>
        <span className="pp-evidence-status">
          {relatedSubmissions.length > 0
            ? `${relatedSubmissions.length} submission(s)`
            : "Evidence pending"}
        </span>
      </div>

      <button
        type="button"
        className="pp-evidence-toggle"
        onClick={() => setShowEvidence((previous) => !previous)}
      >
        {showEvidence ? "Hide evidence ↑" : "View evidence →"}
      </button>

      {showEvidence && (
        <div className="pp-skill-evidence">
          <h4>Challenge evidence</h4>

          {relatedSubmissions.length > 0 ? (
            relatedSubmissions.map((submission) => (
              <div
                className="pp-evidence-item"
                key={submission.id}
              >
                <strong>{submission.challengeTitle}</strong>

                <span className="pp-submitted-label">
                  ● Submitted — awaiting review
                </span>

                <a
                  href={submission.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  Open GitHub repository ↗
                </a>

                {submission.notes && (
                  <p>{submission.notes}</p>
                )}
              </div>
            ))
          ) : (
            <div className="pp-evidence-empty">
              <p>No submissions linked to this skill yet.</p>
              <span>
                Submit a related challenge using the Challenges page.
              </span>
            </div>
          )}
        </div>
      )}
    </article>
  );
}

export default SkillCard;
