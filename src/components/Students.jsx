import { useState } from "react";
import { Search, Trash2, Users, X } from "lucide-react";

export default function Students({ students, onChange, search, setSearch }) {
  const [editing, setEditing] = useState(null);
  const [name, setName] = useState("");
  const [group, setGroup] = useState("");
  const [sport, setSport] = useState("");

  const openForm = (student) => {
    setEditing(student || null);
    setName(student?.name || "");
    setGroup(student?.group || "");
    setSport(student?.sport || "");
  };

  const submit = (event) => {
    event.preventDefault();
    if (!name.trim() || !group.trim() || !sport.trim()) return;
    const item = { id: editing?.id || crypto.randomUUID(), name: name.trim(), group: group.trim(), sport: sport.trim() };
    onChange(editing ? students.map((student) => student.id === editing.id ? item : student) : [...students, item]);
    window.alert(editing ? "Cambios del estudiante guardados correctamente." : "Estudiante registrado correctamente.");
    openForm(null);
  };

  const filtered = students.filter((student) => `${student.name} ${student.group} ${student.sport}`.toLowerCase().includes(search.toLowerCase()));
  return <section className="module-grid">
    <div className="content-card"><div className="section-heading"><div><h2>{editing ? "Editar estudiante" : "Nuevo estudiante"}</h2><p>Datos del alumno.</p></div>{editing && <button className="icon-button" onClick={() => openForm(null)} aria-label="Cancelar edición"><X size={18} /></button>}</div>
      <form className="form-grid" onSubmit={submit}>
        <label>Nombre completo<input value={name} onChange={(event) => setName(event.target.value)} placeholder="Ej. Ana Martínez" maxLength={100} required /></label>
        <label>Grupo<input value={group} onChange={(event) => setGroup(event.target.value)} placeholder="Ej. 5.º A" maxLength={30} required /></label>
        <label>Disciplina deportiva<input value={sport} onChange={(event) => setSport(event.target.value)} placeholder="Ej. Atletismo" maxLength={60} required /></label>
        <button className="btn-primary form-submit" type="submit">{editing ? "Guardar cambios" : "Agregar estudiante"}</button>
      </form>
    </div>
    <div className="content-card"><div className="section-heading"><div><h2>Estudiantes ({students.length})</h2><p>Lista registrada.</p></div></div>
      <div className="search-box"><Search size={18} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar estudiante" /></div>
      {filtered.length === 0 ? <div className="empty-state compact"><Users size={40} /><p>No hay estudiantes que mostrar.</p></div> : <div className="student-list">{filtered.map((student) => <div className="student-row" key={student.id}>
        <div className="avatar small">{student.name.charAt(0).toUpperCase()}</div><div className="student-info"><strong>{student.name}</strong><span>{student.group} · {student.sport}</span><small>ID: {student.id}</small></div>
        <button className="text-button" onClick={() => openForm(student)}>Consultar</button>
        <button className="icon-button danger" aria-label={`Eliminar ${student.name}`} onClick={() => { if (window.confirm(`¿Eliminar a ${student.name}? Sus actividades históricas se conservarán.`)) onChange(students.filter((item) => item.id !== student.id)); }}><Trash2 size={17} /></button>
      </div>)}</div>}
    </div>
  </section>;
}
