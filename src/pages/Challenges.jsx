import { useMemo, useState } from "react";

const initialChallenges = [
  {
    id: 1,
    title: "Build a Responsive Navbar",
    category: "Frontend",
    skill: "HTML & CSS",
    difficulty: "Beginner",
    points: 50,
    description:
      "Create a responsive navigation bar that works on desktop and mobile screens.",
    requirements: [
      "Add a logo and navigation links.",
      "Make the navbar responsive.",
      "Use clean HTML and CSS.",
    ],
  },
  {
    id: 2,
    title: "JavaScript Array Analyzer",
    category: "Programming",
    skill: "JavaScript",
    difficulty: "Beginner",
    points: 75,
    description:
      "Create a JavaScript function that analyzes a list of numbers.",
    requirements: [
      "Calculate the sum and average.",
      "Find the minimum and maximum.",
      "Handle an empty array.",
    ],
  },
  {
    id: 3,
    title: "Interactive To-Do App",
    category: "Frontend",
    skill: "JavaScript",
    difficulty: "Intermediate",
    points: 100,
    description:
      "Build a to-do application where users can manage their tasks.",
    requirements: [
      "Add and delete tasks.",
      "Mark tasks as completed.",
      "Save tasks using localStorage.",
    ],
  },
  {
    id: 4,
    title: "REST API Design",
    category: "Backend",
    skill: "Node.js",
    difficulty: "Intermediate",
    points: 125,
    description:
      "Design a REST API for managing a collection of student records.",
    requirements: [
      "Define GET, POST, PUT and DELETE routes.",
      "Validate incoming data.",
      "Return suitable HTTP status codes.",
    ],
  },
  {
    id: 5,
    title: "SQL Data Explorer",
    category: "Database",
    skill: "SQL",
    difficulty: "Intermediate",
    points: 100,
    description: "Write SQL queries to analyze student and course records.",
    requirements: [
      "Filter records using WHERE.",
      "Use GROUP BY and aggregate functions.",
      "Join students with their courses.",
    ],
  },
  {
    id: 6,
    title: "React Component Dashboard",
    category: "Frontend",
    skill: "React",
    difficulty: "Advanced",
    points: 200,
    description:
      "Create a dashboard with reusable components and dynamic data.",
    requirements: [
      "Build reusable React components.",
      "Manage state using hooks.",
      "Add search and filtering.",
    ],
  },
];

function readSubmissions() {
  try {
    const saved = JSON.parse(
      localStorage.getItem("proofpath_challenge_submissions"),
    );
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

function Challenges() {
  const [challenges] = useState(initialChallenges);
  const [submissions, setSubmissions] = useState(readSubmissions);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [difficulty, setDifficulty] = useState("All");
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [githubUrl, setGithubUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  const filteredChallenges = useMemo(() => {
    return challenges.filter((challenge) => {
      const matchesSearch =
        challenge.title.toLowerCase().includes(search.toLowerCase()) ||
        challenge.skill.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        category === "All" || challenge.category === category;

      const matchesDifficulty =
        difficulty === "All" || challenge.difficulty === difficulty;

      return matchesSearch && matchesCategory && matchesDifficulty;
    });
  }, [challenges, search, category, difficulty]);

  const completedCount = submissions.filter(
    (item) => item.status === "Submitted",
  ).length;

  function submitChallenge(event) {
    event.preventDefault();
    setError("");

    const url = githubUrl.trim();

    if (!/^https:\/\/(www\.)?github\.com\/[^/]+\/[^/]+\/?$/.test(url)) {
      setError("Enter a valid GitHub repository URL.");
      return;
    }

    if (!selectedChallenge) return;

    const newSubmission = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      challengeId: selectedChallenge.id,
      challengeTitle: selectedChallenge.title,
      skill: selectedChallenge.skill,
      githubUrl: url,
      notes: notes.trim(),
      status: "Submitted",
      submittedAt: new Date().toISOString(),
    };

    const updated = [
      ...submissions.filter(
        (item) => item.challengeId !== selectedChallenge.id,
      ),
      newSubmission,
    ];

    setSubmissions(updated);

    try {
      localStorage.setItem(
        "proofpath_challenge_submissions",
        JSON.stringify(updated),
      );
    } catch {
      setError("Could not save your submission. Check browser storage.");
      setSubmissions(submissions);
      return;
    }

    setSelectedChallenge(null);
    setGithubUrl("");
    setNotes("");
  }

  return (
    <section className="pp-challenges">
      <div className="pp-challenges-heading">
        <div>
          <div className="section-kicker">PROVE YOUR SKILLS</div>
          <h1>
            Challenges<span>.</span>
          </h1>
          <p>Turn what you learn into evidence you can share.</p>
        </div>

        <div className="pp-challenge-counter">
          <strong>{completedCount}</strong>
          <span>Submissions</span>
        </div>
      </div>

      <div className="pp-challenge-banner">
        <div>
          <span className="pp-banner-label">YOUR NEXT STEP</span>
          <h2>Learn it. Build it. Prove it.</h2>
          <p>
            Complete a task, submit your project link, and start building your
            evidence history.
          </p>
        </div>
        <div className="pp-banner-icon" aria-hidden="true">
          ✳
        </div>
      </div>

      <div className="pp-challenge-toolbar">
        <input
          className="form-control pp-form-control"
          type="search"
          placeholder="Search challenges or skills..."
          aria-label="Search challenges"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />

        <select
          className="form-select pp-filter-select"
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          aria-label="Filter by category"
        >
          <option>All</option>
          <option>Frontend</option>
          <option>Programming</option>
          <option>Backend</option>
          <option>Database</option>
        </select>

        <select
          className="form-select pp-filter-select"
          value={difficulty}
          onChange={(event) => setDifficulty(event.target.value)}
          aria-label="Filter by difficulty"
        >
          <option>All</option>
          <option>Beginner</option>
          <option>Intermediate</option>
          <option>Advanced</option>
        </select>
      </div>

      <div className="pp-challenge-results">
        <span>{filteredChallenges.length} challenges available</span>
        <span>Submissions are saved on this device</span>
      </div>

      {filteredChallenges.length > 0 ? (
        <div className="pp-challenge-grid">
          {filteredChallenges.map((challenge) => {
            const submission = submissions.find(
              (item) => item.challengeId === challenge.id,
            );

            return (
              <article className="pp-challenge-card" key={challenge.id}>
                <div className="pp-challenge-card-top">
                  <span className="pp-category">{challenge.category}</span>
                  <span
                    className={`pp-difficulty pp-${challenge.difficulty.toLowerCase()}`}
                  >
                    {challenge.difficulty}
                  </span>
                </div>

                <div className="pp-challenge-symbol" aria-hidden="true">
                  {challenge.category === "Frontend"
                    ? "</>"
                    : challenge.category === "Backend"
                      ? "{ }"
                      : challenge.category === "Database"
                        ? "▤"
                        : "⌘"}
                </div>

                <h3>{challenge.title}</h3>
                <p className="pp-challenge-description">
                  {challenge.description}
                </p>

                <div className="pp-challenge-meta">
                  <span>
                    Skill: <strong>{challenge.skill}</strong>
                  </span>
                  <span>✦ {challenge.points} points</span>
                </div>

                {submission && (
                  <div className="pp-submission-status">
                    <span className="pp-status-dot" />
                    Submitted — awaiting review
                  </div>
                )}

                <button
                  type="button"
                  className="primary-button pp-challenge-button"
                  onClick={() => {
                    setSelectedChallenge(challenge);
                    setGithubUrl(submission?.githubUrl || "");
                    setNotes(submission?.notes || "");
                    setError("");
                  }}
                >
                  {submission ? "View / Update Submission" : "View Challenge →"}
                </button>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="pp-empty-skills">
          <h2>No challenges found</h2>
          <p>Try changing your search or filters.</p>
        </div>
      )}

      {selectedChallenge && (
        <div
          className="pp-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedChallenge(null);
              setError("");
            }
          }}
        >
          <section
            className="pp-modal pp-challenge-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="challenge-modal-title"
          >
            <div className="pp-modal-heading">
              <div>
                <span className="section-kicker">
                  {selectedChallenge.category} · {selectedChallenge.difficulty}
                </span>
                <h2 id="challenge-modal-title">{selectedChallenge.title}</h2>
                <p>{selectedChallenge.description}</p>
              </div>

              <button
                type="button"
                className="pp-delete-button"
                aria-label="Close challenge"
                onClick={() => {
                  setSelectedChallenge(null);
                  setError("");
                }}
              >
                ×
              </button>
            </div>

            <h3 className="pp-requirements-title">Requirements</h3>
            <ul className="pp-requirements-list">
              {selectedChallenge.requirements.map((requirement) => (
                <li key={requirement}>{requirement}</li>
              ))}
            </ul>

            <form onSubmit={submitChallenge}>
              <label className="pp-form-label" htmlFor="github-url">
                GitHub repository URL
              </label>
              <input
                id="github-url"
                className="form-control pp-form-control"
                type="url"
                placeholder="https://github.com/username/project"
                value={githubUrl}
                onChange={(event) => setGithubUrl(event.target.value)}
                required
              />

              <label className="pp-form-label" htmlFor="submission-notes">
                What did you build? (optional)
              </label>
              <textarea
                id="submission-notes"
                className="form-control pp-form-control"
                rows="3"
                maxLength="500"
                placeholder="Briefly describe your solution..."
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
              />

              {error && <p className="pp-form-error">{error}</p>}

              <p className="pp-submission-note">
                Your submission is recorded locally. A GitHub link is not
                automatically verified by this prototype.
              </p>

              <div className="pp-modal-actions">
                <button
                  type="button"
                  className="pp-secondary-button"
                  onClick={() => {
                    setSelectedChallenge(null);
                    setError("");
                  }}
                >
                  Cancel
                </button>
                <button type="submit" className="primary-button">
                  Submit solution
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </section>
  );
}

export default Challenges;
