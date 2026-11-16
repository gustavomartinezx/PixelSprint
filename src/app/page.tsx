import Image from "next/image";
import { Badge } from "@/components/Badge";
import { Card } from "@/components/Card";

export default function Home() {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="border-b-4 border-black bg-surface">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4">
          <h1>
            <Image
              src="/brand/logo.png"
              alt="PixelSprint"
              width={156}
              height={64}
              priority
              className="pixelated"
            />
          </h1>
          <Badge tone="accent">Semana</Badge>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6">
        <h2 className="sr-only">Quadro da semana</h2>
        <Card className="flex flex-col items-start gap-3">
          <Badge>Quadro vazio</Badge>
          <p className="max-w-prose leading-7 text-ink-muted">
            Seu quadro de tarefas da semana aparece aqui. Conclua tarefas para
            levar seu avatar até a linha de chegada.
          </p>
        </Card>
      </main>

      <footer
        aria-label="Pista da corrida"
        className="pixelated sticky bottom-0 border-t-4 border-black bg-track bg-[url(/sprites/track/track-tile.png)] bg-size-[64px_96px] bg-repeat-x"
      >
        {/* Sprites 8×24 em escala 4× (= altura da pista). */}
        <div className="relative mx-auto flex h-24 max-w-6xl justify-between px-4">
          <div className="flex items-start gap-1">
            <Image
              src="/sprites/track/start.png"
              alt=""
              width={32}
              height={96}
              className="pixelated"
            />
            <span className="mt-1 bg-ink-dark px-1 py-0.5 font-pixel text-[0.625rem] text-ink">
              Largada
            </span>
          </div>
          <div className="flex items-start gap-1">
            <span className="mt-1 bg-ink-dark px-1 py-0.5 font-pixel text-[0.625rem] text-ink">
              Chegada
            </span>
            <Image
              src="/sprites/track/finish.png"
              alt=""
              width={32}
              height={96}
              className="pixelated"
            />
          </div>
        </div>
      </footer>
    </div>
  );
}
