import { useState } from "react";
import { Activity, ClipboardList, LocateFixed, Users } from "lucide-react";
import { notifyActivitySaved } from "../services/notifications";

function localDateInputValue() {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
}

function formatDate(value) {
  if (!value) return "";
  return new Date(`${value}T00:00:00`).toLocaleDateString("es-MX", { day: "2-digit", month: "short", year: "numeric" });
}

const notificationMessages = {
  shown: "Actividad registrada correctamente. Se mostró una notificación.",
  denied: "Actividad registrada correctamente. El permiso de notificaciones está denegado.",
  dismissed: "Actividad registrada correctamente. No se autorizó mostrar notificaciones.",
  unavailable: "Actividad registrada correctamente. Este navegador no admite notificaciones.",
  failed: "Actividad registrada correctamente, pero no se pudo mostrar la notificación.",
};

export default function Activities({ students, activities, onChange }) {
  const [studentId, setStudentId] = useState("");
  const [name, setName] = useState("");
  const [date, setDate] = useState(localDateInputValue());
  const [duration, setDuration] = useState("");
  const [distance, setDistance] = useState("");
  const [observations, setObservations] = useState("");
  const [location, setLocation] = useState(null);
  const [message, setMessage] = useState("");
  const [locating, setLocating] = useState(false);

  const captureLocation = () => {
    if (!navigator.geolocation) {
      setMessage("Este navegador no ofrece geolocalización.");
      return;
    }
    setLocating(true);
    setMessage("");
    navigator.geolocation.getCurrentPosition((position) => {
      setLocation({ latitude: position.coords.latitude, longitude: position.coords.longitude });
      setLocating(false);
      setMessage("Ubicación agregada.");
    }, () => {
      setLocating(false);
      setMessage("No se pudo obtener la ubicación. Revisa los permisos del navegador; puedes guardar la actividad sin ella.");
    }, { enableHighAccuracy: true, timeout: 10000 });
  };

  const submit = async (event) => {
    event.preventDefault();
    const student = students.find((item) => item.id === studentId);
    const minutes = Number(duration);
    const kilometers = Number(distance);
    if (!student || !name.trim() || !date || !Number.isFinite(minutes) || minutes <= 0 || !Number.isFinite(kilometers) || kilometers < 0) return;

    const activityName = name.trim();
    onChange([{
      id: crypto.randomUUID(), studentId, studentName: student.name, name: activityName,
      date, duration: minutes, distance: kilometers, observations: observations.trim(),
      ...(location ? { location } : {}),
    }, ...activities]);
    setName("");
    setDuration("");
    setDistance("");
    setObservations("");
    setLocation(null);
    setMessage("Actividad guardada. Revisando permiso de notificaciones...");
    const result = await notifyActivitySaved(student.name, activityName);
    window.alert("Actividad registrada correctamente.");
    setMessage(notificationMessages[result]);
  };

  return <section className="module-grid">
    <div className="content-card"><div className="section-heading"><div><h2>Registrar actividad</h2><p>Agrega una sesión deportiva.</p></div><ClipboardList size={24} /></div>
      {students.length === 0 ? <div className="empty-state compact"><Users size={40} /><p>Primero registra al menos un estudiante.</p></div> : <form className="form-grid" onSubmit={submit}>
        <label>Estudiante<select value={studentId} onChange={(event) => setStudentId(event.target.value)} required><option value="">Seleccionar...</option>{students.map((student) => <option key={student.id} value={student.id}>{student.name} · {student.group}</option>)}</select></label>
        <label>Fecha<input type="date" value={date} onChange={(event) => setDate(event.target.value)} required /></label>
        <label>Nombre de la actividad<input value={name} onChange={(event) => setName(event.target.value)} placeholder="Ej. Carrera" maxLength={100} required /></label>
        <label>Duración (min)<input type="number" min="1" max="1440" step="1" value={duration} onChange={(event) => setDuration(event.target.value)} required /></label>
        <label>Distancia (km)<input type="number" min="0" max="1000" step="0.01" value={distance} onChange={(event) => setDistance(event.target.value)} required /></label>
        <label className="full-field">Observaciones<textarea value={observations} onChange={(event) => setObservations(event.target.value)} rows={3} maxLength={500} placeholder="Notas de la sesión (opcional)" /></label>
        <button className="location-button" type="button" onClick={captureLocation} disabled={locating}><LocateFixed size={17} />{locating ? "Obteniendo ubicación..." : location ? "Actualizar ubicación" : "Registrar ubicación"}</button>
        {location && <span className="location-status">{location.latitude.toFixed(5)}, {location.longitude.toFixed(5)}</span>}
        <button className="btn-primary form-submit" type="submit">Guardar actividad</button>
        {message && <span className="saved-message" role="status">{message}</span>}
      </form>}
    </div>
    <div className="content-card"><div className="section-heading"><div><h2>Últimos registros</h2><p>Actividades recientes.</p></div></div>
      {activities.length === 0 ? <div className="empty-state compact"><Activity size={40} /><p>Aún no hay registros.</p></div> : <div className="activity-list">{activities.slice(0, 8).map((item) => <div className="activity-row" key={item.id}><div className="activity-badge"><Activity size={18} /></div><div><strong>{item.name}</strong><span>{item.studentName} · {formatDate(item.date)}</span></div><div className="activity-meta"><b>{item.duration} min</b><span>{item.distance} km</span></div></div>)}</div>}
    </div>
  </section>;
}
