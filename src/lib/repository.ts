import type { AvatarConfig, Task } from "@/lib/models";

/**
 * Única porta de persistência da UI. Assíncrona para que uma API possa substituir o
 * localStorage sem mudar os chamadores. Leituras nunca rejeitam; escritas rejeitam se falharem.
 */
export interface Repository {
  /** `null` quando o avatar ainda não foi criado (primeiro acesso). */
  loadAvatar(): Promise<AvatarConfig | null>;
  saveAvatar(avatar: AvatarConfig): Promise<void>;
  listTasks(): Promise<Task[]>;
  /** Cria ou substitui pelo `id`. */
  saveTask(task: Task): Promise<void>;
  deleteTask(id: string): Promise<void>;
}
