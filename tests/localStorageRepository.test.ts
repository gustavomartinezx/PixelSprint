import { beforeEach, describe, expect, it } from "vitest";
import {
  AVATAR_KEY,
  createLocalStorageRepository,
  getBrowserStorage,
  TASKS_KEY,
} from "@/lib/localStorageRepository";
import { createTask, DEFAULT_AVATAR, type Task } from "@/lib/models";

class MemoryStorage implements Storage {
  private items = new Map<string, string>();
  get length() {
    return this.items.size;
  }
  clear() {
    this.items.clear();
  }
  getItem(key: string) {
    return this.items.get(key) ?? null;
  }
  key(index: number) {
    return [...this.items.keys()][index] ?? null;
  }
  removeItem(key: string) {
    this.items.delete(key);
  }
  setItem(key: string, value: string) {
    this.items.set(key, value);
  }
}

const task = (overrides: Partial<Task> = {}): Task => ({
  ...createTask(
    { weekKey: "2026-11-16", title: "Estudar" },
    new Date("2026-11-16T12:00:00Z"),
  ),
  ...overrides,
});

describe("createLocalStorageRepository", () => {
  let storage: MemoryStorage;
  beforeEach(() => {
    storage = new MemoryStorage();
  });

  it("sem dados: avatar null e lista de tarefas vazia", async () => {
    const repo = createLocalStorageRepository(storage);
    expect(await repo.loadAvatar()).toBeNull();
    expect(await repo.listTasks()).toEqual([]);
  });

  it("persiste avatar e tarefas entre instâncias (simula reload)", async () => {
    const avatar = { ...DEFAULT_AVATAR, hair: "hair-3" };
    const a = task();
    await createLocalStorageRepository(storage).saveAvatar(avatar);
    await createLocalStorageRepository(storage).saveTask(a);

    const reloaded = createLocalStorageRepository(storage);
    expect(await reloaded.loadAvatar()).toEqual(avatar);
    expect(await reloaded.listTasks()).toEqual([a]);
    expect(JSON.parse(storage.getItem(TASKS_KEY)!).version).toBe(1);
  });

  it("saveTask substitui pelo id mantendo a ordem; deleteTask remove só o escolhido", async () => {
    const repo = createLocalStorageRepository(storage);
    const a = task({ id: "a" });
    const b = task({ id: "b" });
    await repo.saveTask(a);
    await repo.saveTask(b);
    await repo.saveTask({ ...a, status: "DONE" });
    expect((await repo.listTasks()).map((t) => [t.id, t.status])).toEqual([
      ["a", "DONE"],
      ["b", "TODO"],
    ]);
    await repo.deleteTask("a");
    expect((await repo.listTasks()).map((t) => t.id)).toEqual(["b"]);
  });

  it("avatar e tarefas são independentes", async () => {
    const repo = createLocalStorageRepository(storage);
    await repo.saveTask(task());
    await repo.saveAvatar({ ...DEFAULT_AVATAR, eyes: "eyes-2" });
    expect(await repo.listTasks()).toHaveLength(1);
  });

  it.each([
    ["JSON corrompido", "{not json"],
    ["null", "null"],
    ["sem envelope", JSON.stringify([{ id: "x" }])],
    ["versão desconhecida", JSON.stringify({ version: 99, data: [] })],
  ])("dados inválidos (%s) não derrubam a leitura", async (_, raw) => {
    storage.setItem(AVATAR_KEY, raw);
    storage.setItem(TASKS_KEY, raw);
    const repo = createLocalStorageRepository(storage);
    expect(await repo.loadAvatar()).toBeNull();
    expect(await repo.listTasks()).toEqual([]);
  });

  it("descarta só as tarefas inválidas e completa campos ausentes do avatar", async () => {
    const valid = task({ id: "ok" });
    storage.setItem(
      TASKS_KEY,
      JSON.stringify({
        version: 1,
        data: [valid, { ...valid, id: "bad", status: "LATER" }, 42],
      }),
    );
    storage.setItem(
      AVATAR_KEY,
      JSON.stringify({ version: 1, data: { hair: "hair-2", skin: 7 } }),
    );
    const repo = createLocalStorageRepository(storage);
    expect(await repo.listTasks()).toEqual([valid]);
    expect(await repo.loadAvatar()).toEqual({
      ...DEFAULT_AVATAR,
      hair: "hair-2",
    });
  });

  it("storage indisponível: leitura usa padrões e escrita rejeita", async () => {
    const repo = createLocalStorageRepository(null);
    expect(await repo.loadAvatar()).toBeNull();
    expect(await repo.listTasks()).toEqual([]);
    await expect(repo.saveTask(task())).rejects.toThrow();
  });

  it("storage que lança erro (bloqueado/cota cheia)", async () => {
    const broken = new MemoryStorage();
    broken.getItem = () => {
      throw new Error("SecurityError");
    };
    broken.setItem = () => {
      throw new Error("QuotaExceededError");
    };
    const repo = createLocalStorageRepository(broken);
    expect(await repo.listTasks()).toEqual([]);
    await expect(repo.saveAvatar(DEFAULT_AVATAR)).rejects.toThrow();
  });

  it("no servidor (sem window) não há storage", () => {
    expect(getBrowserStorage()).toBeNull();
  });
});

describe("createTask", () => {
  it("gera id único, status TODO e datas ISO iguais", () => {
    const now = new Date("2026-11-16T12:00:00Z");
    const a = createTask({ weekKey: "2026-11-16", title: "A" }, now);
    const b = createTask({ weekKey: "2026-11-16", title: "B" }, now);
    expect(a.id).not.toBe(b.id);
    expect(a).toMatchObject({
      status: "TODO",
      createdAt: "2026-11-16T12:00:00.000Z",
      updatedAt: "2026-11-16T12:00:00.000Z",
    });
    expect(a).not.toHaveProperty("description");
  });
});
