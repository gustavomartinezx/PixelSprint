import {
  DEFAULT_AVATAR,
  TASK_STATUSES,
  type AvatarConfig,
  type Task,
} from "@/lib/models";
import type { Repository } from "@/lib/repository";

export const SCHEMA_VERSION = 1;
export const AVATAR_KEY = "pixelsprint.avatar";
export const TASKS_KEY = "pixelsprint.tasks";

type Envelope = { version: number; data: unknown };

/** `null` no servidor (SSR) ou quando o navegador bloqueia o acesso ao storage. */
export function getBrowserStorage(): Storage | null {
  try {
    return typeof window === "undefined" ? null : window.localStorage;
  } catch {
    return null;
  }
}

function read(storage: Storage | null, key: string): unknown {
  try {
    const raw = storage?.getItem(key);
    if (!raw) return undefined;
    const parsed = JSON.parse(raw) as Partial<Envelope> | null;
    // shortcut: versão diferente é tratada como ausente; criar migração ao subir SCHEMA_VERSION.
    return parsed?.version === SCHEMA_VERSION ? parsed.data : undefined;
  } catch {
    return undefined;
  }
}

function write(storage: Storage | null, key: string, data: unknown) {
  if (!storage) throw new Error("Armazenamento local indisponível.");
  const envelope: Envelope = { version: SCHEMA_VERSION, data };
  storage.setItem(key, JSON.stringify(envelope));
}

const isString = (value: unknown): value is string => typeof value === "string";
const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

function toAvatar(data: unknown): AvatarConfig | null {
  if (!isRecord(data)) return null;
  const avatar = { ...DEFAULT_AVATAR };
  for (const field of Object.keys(avatar) as (keyof AvatarConfig)[]) {
    if (isString(data[field])) avatar[field] = data[field];
  }
  return avatar;
}

function isTask(value: unknown): value is Task {
  return (
    isRecord(value) &&
    isString(value.id) &&
    isString(value.weekKey) &&
    /^\d{4}-\d{2}-\d{2}$/.test(value.weekKey) &&
    isString(value.title) &&
    (value.description === undefined || isString(value.description)) &&
    TASK_STATUSES.includes(value.status as Task["status"]) &&
    isString(value.createdAt) &&
    isString(value.updatedAt)
  );
}

function toTasks(data: unknown): Task[] {
  // Registros inválidos são descartados individualmente, sem perder os válidos.
  return Array.isArray(data) ? data.filter(isTask) : [];
}

export function createLocalStorageRepository(
  storage: Storage | null = getBrowserStorage(),
): Repository {
  const tasks = () => toTasks(read(storage, TASKS_KEY));

  return {
    async loadAvatar() {
      return toAvatar(read(storage, AVATAR_KEY));
    },
    async saveAvatar(avatar) {
      write(storage, AVATAR_KEY, avatar);
    },
    async listTasks() {
      return tasks();
    },
    async saveTask(task) {
      const current = tasks();
      const index = current.findIndex((t) => t.id === task.id);
      write(
        storage,
        TASKS_KEY,
        index === -1 ? [...current, task] : current.with(index, task),
      );
    },
    async deleteTask(id) {
      write(
        storage,
        TASKS_KEY,
        tasks().filter((t) => t.id !== id),
      );
    },
  };
}
