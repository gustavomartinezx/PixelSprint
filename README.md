# PixelSprint

Gerenciador semanal de tarefas gamificado em pixel art: monte seu avatar e conclua tarefas para levá-lo até a linha de chegada da semana.

Stack: Next.js (App Router) + React + TypeScript strict + Tailwind CSS. Testes de lógica com Vitest.

## Requisitos

- Node.js 20.9 ou superior
- npm

## Instalar

```bash
npm install
```

## Rodar

```bash
npm run dev        # desenvolvimento em http://localhost:3000
npm run build      # build de produção
npm run start      # serve o build de produção
```

## Executável desktop (Linux e Windows)

O app é exportado como site estático (`out/`) e empacotado com [Tauri 2](https://v2.tauri.app/) (`src-tauri/`).

Pré-requisitos extras:

- Rust (via [rustup](https://rustup.rs/))
- **Linux (Debian/Ubuntu):**
  ```bash
  sudo apt install libwebkit2gtk-4.1-dev build-essential curl wget file libxdo-dev libssl-dev libayatana-appindicator3-dev librsvg2-dev
  ```
- **Windows:** Microsoft C++ Build Tools e WebView2 (já vem no Windows 10/11).

```bash
npm run desktop:dev    # abre a janela desktop com hot reload
npm run desktop:build  # gera instaladores em src-tauri/target/release/bundle/
```

Cada sistema gera o próprio executável: compile no Linux para obter `.deb`/`.AppImage`/`.rpm` e no Windows para obter `.msi`/`.exe`.

## Qualidade

```bash
npm run lint          # ESLint
npm run typecheck     # TypeScript (gera os tipos de rota do Next antes)
npm test              # Vitest
npm run format        # Prettier (formata)
npm run format:check  # Prettier (só verifica)
```

## Estrutura

```
src/
  app/         rotas e layout (Next.js App Router)
  components/  componentes de UI reutilizáveis
  features/    módulos de funcionalidade (avatar, tarefas, pista)
  lib/         lógica pura, modelos e persistência
  assets/      sprites e demais assets
tests/         testes (Vitest)
```

Não há variáveis de ambiente: o app roda sem backend.
