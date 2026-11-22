export type DemoPost = {
  userId: number;
  id: number;
  title: string;
  body: string;
};

const DEMO_POSTS_ENDPOINT = "https://jsonplaceholder.typicode.com/posts";
const SPANISH_TRANSLATIONS: Record<number, Pick<DemoPost, "title" | "body">> = {
  1: {
    title: "Es mejor rechazar con prudencia las ofensas ajenas",
    body: "Aunque las cosas no salgan como esperas, puedes aceptar lo ocurrido y seguir adelante. Incluso aquello que parece un obstáculo puede convertirse en una oportunidad.",
  },
  2: {
    title: "¿Quién es?",
    body: "Es alguien que vive el presente y sigue su camino. No se deja vencer por el dolor ni por las dificultades; busca disfrutar de lo bueno y dejar atrás lo que no puede cambiar.",
  },
  3: {
    title: "Molestias que parecen inevitables",
    body: "Aun cuando algo parezca justo o conveniente, conviene pensar antes de elegirlo. El dolor puede surgir de decisiones apresuradas y traer consecuencias que luego es difícil reparar.",
  },
};

export async function fetchDemoPosts(signal?: AbortSignal): Promise<DemoPost[]> {
  const response = await fetch(DEMO_POSTS_ENDPOINT, { signal });
  if (!response.ok) {
    throw new Error(`El servicio respondió con el estado ${response.status}.`);
  }

  const data: unknown = await response.json();
  if (!Array.isArray(data)) {
    throw new Error("El servicio devolvió una respuesta no válida.");
  }

  return (data.slice(0, 3) as DemoPost[]).map((post) => ({
    ...post,
    ...(SPANISH_TRANSLATIONS[post.id] ?? {}),
  }));
}
