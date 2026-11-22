import { useEffect, useState } from "react";
import { Activity, ChartNoAxesCombined, ClipboardList, Clock, MapPin, Trophy, Users } from "lucide-react";
import { fetchDemoPosts } from "../services/api";

function formatDate(value) {
  if (!value) return "";
  return new Date(`${value}T00:00:00`).toLocaleDateString("es-MX", { day: "2-digit", month: "short", year: "numeric" });
}

function StatCard({ icon, tone, label, value, detail }) {
  return <article className="stat-card"><div className={`stat-icon ${tone}`}>{icon}</div><p>{label}</p><h2>{value}</h2><small>{detail}</small></article>;
}

function RecentActivities({ activities, onView }) {
  const recent = [...activities].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5);
  return <section className="content-card"><div className="section-heading"><div><h2>Actividad reciente</h2><p>Consulta los últimos registros deportivos.</p></div><Activity size={25} /></div>
    {recent.length === 0 ? <div className="empty-state"><ClipboardList size={45} /><h3>Sin actividades registradas</h3><p>Cuando registres actividades deportivas, aparecerán en esta sección.</p></div> : <div className="activity-list">{recent.map((item) => <div className="activity-row" key={item.id}><div className="activity-badge"><Activity size={18} /></div><div><strong>{item.name}</strong><span>{item.studentName} · {formatDate(item.date)}</span></div><div className="activity-meta"><b>{item.duration} min</b><span>{item.distance} km</span></div></div>)}</div>}
    {recent.length > 0 && <button className="text-button" onClick={onView}>Ver historial completo</button>}
  </section>;
}

function DemoPostsPanel() {
  const [posts, setPosts] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    fetchDemoPosts(controller.signal).then((result) => {
      setPosts(result);
      setStatus("success");
    }).catch((reason) => {
      if (reason instanceof Error && reason.name === "AbortError") return;
      setError(reason instanceof Error ? reason.message : "No fue posible consultar los datos de demostración.");
      setStatus("error");
    });
    return () => controller.abort();
  }, [retry]);

  return <section className="content-card demo-card">
    <div className="section-heading"><div><h2>Consulta de demostración</h2><p>Fetch API · JSONPlaceholder</p></div><ChartNoAxesCombined size={24} /></div>
    <p className="demo-disclaimer">Estos datos son solo una demostración; no se sincronizan ni se guardan en SportSchool.</p>
    {status === "loading" && <p className="demo-status" role="status">Consultando el servicio público...</p>}
    {status === "error" && <div className="demo-error" role="alert"><span>No se pudieron cargar los datos: {error}</span><button className="text-button" onClick={() => { setStatus("loading"); setError(""); setRetry((value) => value + 1); }}>Reintentar</button></div>}
    {status === "success" && <><p className="demo-status" role="status">Consulta completada. Se muestran {posts.length} publicaciones de ejemplo.</p><ul className="demo-post-list">{posts.map((post) => <li key={post.id}><strong>{post.title}</strong><span>{post.body}</span></li>)}</ul></>}
  </section>;
}

export default function Dashboard({ students, activities, onViewHistory }) {
  const totalMinutes = activities.reduce((sum, item) => sum + Number(item.duration || 0), 0);
  const totalDistance = activities.reduce((sum, item) => sum + Number(item.distance || 0), 0);
  return <>
    <section className="welcome"><div><span className="welcome-label">BIENVENIDO A SPORTSCHOOL</span><h1>Controla el rendimiento deportivo</h1><p>Administra estudiantes y consulta sus avances deportivos desde un solo lugar.</p></div><Trophy size={90} className="welcome-icon" /></section>
    <section className="stats-grid"><StatCard icon={<Users />} tone="blue" label="Estudiantes registrados" value={String(students.length)} detail="Alumnos registrados" /><StatCard icon={<Activity />} tone="green" label="Actividades realizadas" value={String(activities.length)} detail="Registros deportivos" /><StatCard icon={<Clock />} tone="orange" label="Tiempo acumulado" value={`${totalMinutes} min`} detail="Minutos de actividad" /><StatCard icon={<MapPin />} tone="purple" label="Distancia recorrida" value={`${totalDistance.toFixed(1)} km`} detail="Kilómetros registrados" /></section>
    <RecentActivities activities={activities} onView={onViewHistory} />
    <DemoPostsPanel />
  </>;
}
