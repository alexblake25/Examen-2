import { Menu } from "lucide-react";

export default function Navbar({ section, teacher, onMenuClick }) {
  return <header className="topbar">
    <button className="menu-toggle" aria-label="Abrir menú" onClick={onMenuClick}><Menu size={25} /></button>
    <div><h2>{section}</h2><p>Panel de seguimiento deportivo</p></div>
    <div className="user-profile"><div className="avatar">{(teacher || "D").charAt(0).toUpperCase()}</div><span>{teacher || "Docente"}</span></div>
  </header>;
}
