import { useMemo, useState } from "react";
import { Activity, ClipboardList, Trash2 } from "lucide-react";

function formatDate(value) {
  if (!value) return "";
  return new Date(`${value}T00:00:00`).toLocaleDateString("es-MX", { day: "2-digit", month: "short", year: "numeric" });
}

export default function History({ students, activities, onChange }) {
  const [studentId, setStudentId] = useState("");
  const filtered = useMemo(() => activities
    .filter((item) => !studentId || item.studentId === studentId)
    .sort((a, b) => b.date.localeCompare(a.date)), [activities, studentId]);

  return <section className="content-card"><div className="section-heading"><div><h2>Historial deportivo</h2><p>{filtered.length} registro(s) encontrado(s).</p></div><Activity size={24} /></div>
    <label className="filter-label">Filtrar por estudiante<select value={studentId} onChange={(event) => setStudentId(event.target.value)}><option value="">Todos los estudiantes</option>{students.map((student) => <option key={student.id} value={student.id}>{student.name} · {student.group}</option>)}</select></label>
    {filtered.length === 0 ? <div className="empty-state"><ClipboardList size={45} /><h3>Sin actividades registradas</h3><p>Registra una actividad para que aparezca aquí.</p></div> : <div className="table-wrap"><table><thead><tr><th>Fecha</th><th>Estudiante</th><th>Actividad</th><th>Duración</th><th>Distancia</th><th>Observaciones</th><th>Ubicación</th><th></th></tr></thead><tbody>{filtered.map((item) => <tr key={item.id}>
      <td>{formatDate(item.date)}</td><td>{item.studentName}</td><td>{item.name}</td><td>{item.duration} min</td><td>{item.distance} km</td><td>{item.observations || "—"}</td>
      <td>{item.location ? <a href={`https://www.google.com/maps?q=${item.location.latitude},${item.location.longitude}`} target="_blank" rel="noreferrer">Ver mapa</a> : "—"}</td>
      <td><button className="icon-button danger" aria-label={`Eliminar ${item.name}`} onClick={() => { if (window.confirm(`¿Eliminar la actividad “${item.name}”?`)) onChange(activities.filter((entry) => entry.id !== item.id)); }}><Trash2 size={16} /></button></td>
    </tr>)}</tbody></table></div>}
  </section>;
}
