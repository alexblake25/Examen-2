export type StudentRecord = {
  id: string;
  name: string;
  group: string;
  sport: string;
};

export type ActivityRecord = {
  id: string;
  studentId: string;
  studentName: string;
  name: string;
  date: string;
  duration: number;
  distance: number;
  observations: string;
  location?: { latitude: number; longitude: number };
};

export type AppSettings = { school: string; teacher: string };

const KEYS = {
  students: "sportschool_students",
  activities: "sportschool_activities",
  settings: "sportschool_settings",
} as const;

function readArray<T>(key: string): T[] {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(key) ?? "[]");
    return Array.isArray(value) ? value as T[] : [];
  } catch {
    return [];
  }
}

function write<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error("No se pudieron guardar los datos en este dispositivo.", error);
    throw new Error("No se pudieron guardar los datos. Revisa el espacio disponible del navegador.", { cause: error });
  }
}

export function getStudents(): StudentRecord[] {
  return readArray<StudentRecord & { sport?: string }>(KEYS.students).map((student) => ({
    ...student,
    sport: student.sport ?? "Sin disciplina",
  }));
}

export function saveStudents(students: StudentRecord[]): void {
  write(KEYS.students, students);
}

export function getActivities(): ActivityRecord[] {
  return readArray<ActivityRecord>(KEYS.activities).map((activity) => ({
    ...activity,
    observations: activity.observations ?? "",
  }));
}

export function saveActivities(activities: ActivityRecord[]): void {
  write(KEYS.activities, activities);
}

export function getSettings(): AppSettings {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(KEYS.settings) ?? "null");
    if (value && typeof value === "object") {
      const settings = value as Partial<AppSettings>;
      return { school: settings.school ?? "SportSchool", teacher: settings.teacher ?? "Docente" };
    }
  } catch {
    // A corrupt settings entry should not prevent the app from starting.
  }
  return { school: "SportSchool", teacher: "Docente" };
}

export function saveSettings(settings: AppSettings): void {
  write(KEYS.settings, settings);
}
