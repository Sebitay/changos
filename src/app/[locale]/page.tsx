"use client";
import { useTranslations } from "next-intl";
import { ThemeToggle } from "@/components/themeToggle";

export default function HomePage() {
  const t = useTranslations("HomePage");
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">{t("title")}</h1>
      <p>{t("description")}</p>
      <ThemeToggle />
    </main>
  );
}
