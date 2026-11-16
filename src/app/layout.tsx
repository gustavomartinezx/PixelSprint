import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PixelSprint",
  description: "Gerenciador semanal de tarefas gamificado em pixel art.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className="h-full antialiased">
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
