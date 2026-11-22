export type ActivityNotificationResult =
  | "shown"
  | "denied"
  | "dismissed"
  | "unavailable"
  | "failed";

export async function notifyActivitySaved(
  studentName: string,
  activityName: string,
): Promise<ActivityNotificationResult> {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return "unavailable";
  }

  try {
    let permission = Notification.permission;
    if (permission === "default") {
      permission = await Notification.requestPermission();
    }

    if (permission === "denied") return "denied";
    if (permission !== "granted") return "dismissed";

    new Notification("Actividad registrada", {
      body: `${activityName} · ${studentName}`,
      icon: "/icons/icon-192.png",
    });
    return "shown";
  } catch {
    return "failed";
  }
}
