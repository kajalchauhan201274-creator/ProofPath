import { useEffect, useState } from "react";
import MySkills from "./pages/MySkills";
import Challenges from "./pages/Challenges";
import "./App.css";

const navigation = [
  { icon: "◫", label: "Overview" },
  { icon: "◇", label: "My Skills" },
  { icon: "⚡", label: "Challenges" },
  { icon: "⌘", label: "Projects" },
  { icon: "▣", label: "Proof Cards" },
];

function readSavedSkills() {
  try {
    const saved = localStorage.getItem("proofpath_skills");
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function App() {
  const [activePage, setActivePage] = useState("Overview");
  const [skills, setSkills] = useState(readSavedSkills);

  useEffect(() => {
    localStorage.setItem("proofpath_skills", JSON.stringify(skills));
  }, [skills]);

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">P</div>
          <span>
            Proof<span className="brand-accent">Path</span>
          </span>
        </div>

        <div className="workspace-label">WORKSPACE</div>

        <nav className="nav-menu">
          {navigation.map((item) => (
            <button
              key={item.label}
              className={`nav-item ${
                activePage === item.label ? "active" : ""
              }`}
              onClick={() => setActivePage(item.label)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span>{item.label}</span>
              {item.label === "My Skills" && (
                <span className="nav-count">{skills.length}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="upgrade-card">
            <div className="upgrade-symbol">✦</div>
            <h6>Build your proof.</h6>
            <p>Every skill deserves evidence.</p>
            <button onClick={() => setActivePage("Challenges")}>
              Explore challenges ↗
            </button>
          </div>

          <div className="profile">
            <div className="avatar">S</div>
            <div>
              <strong>Student User</strong>
              <small>Free workspace</small>
            </div>
            <span className="profile-dots">•••</span>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="breadcrumb">
            Workspace <span>/</span> {activePage}
          </div>

          <div className="topbar-right">
            <span className="live-status">
              <span /> Saved in this browser
            </span>
            <div className="avatar small-avatar">S</div>
          </div>
        </header>

        <div className="page-container">
          {activePage === "My Skills" ? (
            <MySkills skills={skills} setSkills={setSkills} />
          ) : activePage === "Challenges" ? (
            <Challenges />
          ) : activePage === "Overview" ? (
            <Overview
              skills={skills}
              onOpenSkills={() => setActivePage("My Skills")}
              onOpenChallenges={() => setActivePage("Challenges")}
            />
          ) : (
            <section className="pp-placeholder">
              <div className="section-kicker">PROOFPATH WORKSPACE</div>
              <h1>
                {activePage}
                <span>.</span>
              </h1>
              <p>
                This section is coming next. Your My Skills page is ready to
                use.
              </p>
              <button
                className="primary-button"
                onClick={() => setActivePage("My Skills")}
              >
                Go to My Skills →
              </button>
            </section>
          )}

          <footer className="page-footer">
            <span>
              PROOFPATH <span className="footer-dot">●</span> BUILD YOUR PROOF.
            </span>
            <span>Progress is a process, not a promise.</span>
          </footer>
        </div>
      </main>
    </div>
  );
}

function Overview({ skills, onOpenSkills, onOpenChallenges }) {
  return (
    <>
      <section className="welcome-section">
        <div>
          <div className="eyebrow">
            <span /> YOUR SKILLS, VERIFIED
          </div>
          <h1>
            Turn your skills into <span>proof.</span>
          </h1>
          <p className="welcome-description">
            Build skills. Complete challenges. Collect evidence. Show the world
            what you can actually do.
          </p>
        </div>

        <button className="primary-button" onClick={onOpenChallenges}>
          + Explore challenges
        </button>
      </section>

      <section className="stats-grid">
        <StatCard
          icon="◇"
          label="Skills tracked"
          value={skills.length}
          tone="purple"
        />
        <StatCard icon="✓" label="Challenges passed" value="0" tone="green" />
        <StatCard icon="⌘" label="Projects linked" value="0" tone="blue" />
        <StatCard icon="↗" label="Evidence linked" value="0" tone="orange" />
      </section>

      <section className="panel pp-overview-panel">
        <div className="panel-heading">
          <div>
            <div className="section-kicker">YOUR DEVELOPMENT</div>
            <h2>Your skill journey</h2>
            <p>Your skills are saved locally in this browser.</p>
          </div>
          <button className="text-button" onClick={onOpenSkills}>
            Manage skills →
          </button>
        </div>

        {skills.length === 0 ? (
          <div className="pp-overview-empty">
            <div className="pp-empty-icon">◇</div>
            <h3>Your journey starts here.</h3>
            <p>Add a skill to start building your evidence profile.</p>
            <button className="primary-button" onClick={onOpenSkills}>
              + Add your first skill
            </button>
          </div>
        ) : (
          <div className="pp-overview-skills">
            {skills.slice(0, 4).map((skill) => (
              <div className="pp-overview-skill" key={skill.id}>
                <div className="pp-skill-avatar">
                  {skill.name.charAt(0).toUpperCase()}
                </div>
                <div className="pp-overview-skill-info">
                  <strong>{skill.name}</strong>
                  <span>
                    {skill.category} · {skill.level}
                  </span>
                </div>
              </div>
            ))}
            <button className="add-skill-button" onClick={onOpenSkills}>
              View all {skills.length} skills →
            </button>
          </div>
        )}
      </section>

      <section className="tip-panel pp-overview-tip">
        <div className="tip-icon">✦</div>
        <div>
          <strong>Proof over promises.</strong>
          <p>
            A skill becomes more convincing when you link it to completed
            challenges and real projects.
          </p>
          <button onClick={onOpenChallenges}>Explore challenges ↗</button>
        </div>
      </section>
    </>
  );
}

function StatCard({ icon, label, value, tone }) {
  return (
    <div className="stat-card">
      <div className={`stat-icon ${tone}`}>{icon}</div>
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
      <div className="stat-note">Updated from your workspace</div>
    </div>
  );
}

export default App;
