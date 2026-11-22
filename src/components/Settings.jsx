import { useState } from "react";
import { Settings as SettingsIcon } from "lucide-react";

export default function Settings({ settings, onSave }) {
  const [school, setSchool] = useState(settings.school || "");
  const [teacher, setTeacher] = useState(settings.teacher || "");
  const [saved, setSaved] = useState(false);

  const submit = (event) => {
    event.preventDefault();
    onSave({ school: school.trim(), teacher: teacher.trim() });
    setSaved(true);
  };

  return <section className="content-card settings-card"><div className="section-heading"><div><h2>Configuración general</h2><p>Personaliza la información de tu institución.</p></div><SettingsIcon size={24} /></div>
    <form className="form-grid" onSubmit={submit}>
      <label>Nombre de la institución<input value={school} onChange={(event) => { setSchool(event.target.value); setSaved(false); }} required /></label>
      <label>Nombre del docente<input value={teacher} onChange={(event) => { setTeacher(event.target.value); setSaved(false); }} required /></label>
      <button className="btn-primary form-submit" type="submit">Guardar configuración</button>
      {saved && <span className="saved-message">Configuración guardada correctamente.</span>}
    </form>
  </section>;
}
