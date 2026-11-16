export const TASK_STATUSES = ["TODO", "IN_PROGRESS", "DONE"] as const;
export type TaskStatus = (typeof TASK_STATUSES)[number];

/** Data local da segunda-feira da semana, no formato `YYYY-MM-DD`. */
export type WeekKey = string;

export type Task = {
  id: string;
  weekKey: WeekKey;
  title: string;
  description?: string;
  status: TaskStatus;
  /** ISO 8601 em UTC (`Date#toISOString`). */
  createdAt: string;
  updatedAt: string;
};

/** IDs de opção do manifesto de sprites (PS-004); IDs desconhecidos caem no fallback do renderizador. */
export type AvatarConfig = {
  baseStyle: string;
  skin: string;
  eyes: string;
  hair: string;
  outfit: string;
  accessory: string;
};

export const DEFAULT_AVATAR: AvatarConfig = {
  baseStyle: "base-1",
  skin: "skin-1",
  eyes: "eyes-1",
  hair: "hair-1",
  outfit: "outfit-1",
  accessory: "none",
};

export function createTask(
  input: { weekKey: WeekKey; title: string; description?: string },
  now = new Date(),
): Task {
  const timestamp = now.toISOString();
  return {
    id: crypto.randomUUID(),
    weekKey: input.weekKey,
    title: input.title,
    ...(input.description ? { description: input.description } : {}),
    status: "TODO",
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}
