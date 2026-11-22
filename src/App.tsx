import { useState } from "react";
import { Trophy } from "lucide-react";
import Activities from "./components/Activities.jsx";
import Dashboard from "./components/Dashboard.jsx";
import History from "./components/History.jsx";
import Navbar from "./components/Navbar.jsx";
import Performance from "./components/Performance.jsx";
import Settings from "./components/Settings.jsx";
import Sidebar from "./components/Sidebar.jsx";
import Students from "./components/Students.jsx";
import { getActivities, getSettings, getStudents, saveActivities as persistActivities, saveSettings as persistSettings, saveStudents as persistStudents } from "./services/storage";
import type { ActivityRecord, AppSettings, StudentRecord } from "./services/storage";
import "./styles.css";

function App() {
  const [started, setStarted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [section, setSection] = useState("Inicio");
  const [students, setStudents] = useState<StudentRecord[]>(getStudents);
  const [activities, setActivities] = useState<ActivityRecord[]>(getActivities);
  const [settings, setSettings] = useState<AppSettings>(getSettings);
  const [search, setSearch] = useState("");

  const saveStudents = (value: StudentRecord[]) => {
    persistStudents(value);
    setStudents(value);
  };
  const saveActivities = (value: ActivityRecord[]) => {
    persistActivities(value);
    setActivities(value);
  };
  const saveSettings = (value: AppSettings) => {
    persistSettings(value);
    setSettings(value);
  };
  const navigate = (destination: string) => {
    setSection(destination);
    setMenuOpen(false);
  };

  if (!started) {
    return <main className="splash"><div className="splash-content">
      <div className="logo"><Trophy size={55} /></div>
      <h1>Sport<span>School</span></h1>
      <p>Seguimiento y desempeño deportivo escolar</p>
      <button className="btn-primary" onClick={() => setStarted(true)}>Comenzar</button>
      <small>Tu rendimiento, nuestro objetivo.</small>
    </div></main>;
  }

  return <div className="app-container">
    <Sidebar section={section} onNavigate={navigate} menuOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    <main className="main-content">
      <Navbar section={section} teacher={settings.teacher} onMenuClick={() => setMenuOpen(true)} />
      {section === "Inicio" && <Dashboard students={students} activities={activities} onViewHistory={() => navigate("Historial")} />}
      {section === "Estudiantes" && <Students students={students} onChange={saveStudents} search={search} setSearch={setSearch} />}
      {section === "Actividades" && <Activities students={students} activities={activities} onChange={saveActivities} />}
      {section === "Historial" && <History students={students} activities={activities} onChange={saveActivities} />}
      {section === "Desempeño" && <Performance students={students} activities={activities} />}
      {section === "Configuración" && <Settings settings={settings} onSave={saveSettings} />}
      <footer className="footer">{settings.school || "SportSchool"} © {new Date().getFullYear()} | Seguimiento deportivo escolar</footer>
    </main>
  </div>;
}

export default App;
