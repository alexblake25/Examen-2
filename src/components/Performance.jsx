import { Activity, Clock, MapPin, Trophy, Users } from "lucide-react";

function StatCard({ icon, tone, label, value, detail }) {
  return <article className="stat-card"><div className={`stat-icon ${tone}`}>{icon}</div><p>{label}</p><h2>{value}</h2><small>{detail}</small></article>;
}

export default function Performance({ students, activities }) {
  const minutes = activities.reduce((sum, item) => sum + Number(item.duration || 0), 0);
  const distance = activities.reduce((sum, item) => sum + Number(item.distance || 0), 0);
  const ranking = students.map((student) => ({
    ...student,
    count: activities.filter((item) => item.studentId === student.id).length,
  })).sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));

  return <section>
    <section className="stats-grid performance-grid">
      <StatCard icon={<Activity />} tone="blue" label="Total de actividades" value={String(activities.length)} detail="Registros deportivos" />
      <StatCard icon={<Clock />} tone="orange" label="Tiempo acumulado" value={`${minutes} min`} detail="Minutos registrados" />
      <StatCard icon={<MapPin />} tone="purple" label="Distancia recorrida" value={`${distance.toFixed(1)} km`} detail="Kilómetros registrados" />
    </section>
    <div className="content-card"><div className="section-heading"><div><h2>Resumen por estudiante</h2><p>Actividad registrada por alumno, calculada con datos guardados.</p></div><Trophy size={24} /></div>
      {ranking.length === 0 ? <div className="empty-state compact"><Users size={40} /><p>Registra estudiantes y actividades para visualizar resultados.</p></div> : <div className="ranking-list">{ranking.map((student, index) => <div className="ranking-row" key={student.id}>
        <span className="rank-number">{index + 1}</span><div className="ranking-info"><strong>{student.name}</strong><span>{student.group} · {student.sport} · {student.count} actividad(es)</span><div className="progress-track"><div className="progress-bar" style={{ width: `${activities.length ? (student.count / activities.length) * 100 : 0}%` }} /></div></div><b>{student.count}</b>
      </div>)}</div>}
    </div>
  </section>;
}
