import type { Metadata } from "next";
import { Press_Start_2P } from "next/font/google";
import "@/app/globals.css";

const pixelFont = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-press-start",
});

export const metadata: Metadata = {
  title: "PixelSprint",
  description: "Gerenciador semanal de tarefas gamificado em pixel art.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`h-full antialiased ${pixelFont.variable}`}>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
