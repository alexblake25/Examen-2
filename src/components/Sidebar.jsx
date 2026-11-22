import { Activity, ChartNoAxesCombined, ClipboardList, Dumbbell, LayoutDashboard, Settings, Trophy, Users } from "lucide-react";

const sections = [
  { name: "Inicio", icon: LayoutDashboard },
  { name: "Estudiantes", icon: Users },
  { name: "Actividades", icon: ClipboardList },
  { name: "Historial", icon: Activity },
  { name: "Desempeño", icon: ChartNoAxesCombined },
  { name: "Configuración", icon: Settings },
];

export default function Sidebar({ section, onNavigate, menuOpen, onClose }) {
  return <>
    {menuOpen && <button className="sidebar-backdrop" aria-label="Cerrar menú" onClick={onClose} />}
    <aside className={`sidebar ${menuOpen ? "show" : ""}`}>
      <div className="brand"><Trophy size={30} /><h2>Sport<span>School</span></h2></div>
      <p className="menu-title">MENÚ PRINCIPAL</p>
      <nav>{sections.map(({ name, icon: Icon }) => <button key={name} className={`nav-item ${section === name ? "active" : ""}`} onClick={() => onNavigate(name)}><Icon size={20} />{name}</button>)}</nav>
      <div className="sidebar-bottom"><Dumbbell size={20} /><span>SportSchool PWA</span></div>
    </aside>
  </>;
}
