"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useLocale, useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { H1 } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("LoginPage");

  async function handleLogin() {
    if (!email || !password || isLoading) return;

    setError("");
    setIsLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setIsLoading(false);

    if (result?.error) {
      setError(t("errorMessage"));
      return;
    }

    router.push(`/${locale}/admin`);
    router.refresh();
  }

  return (
    <div className="flex justify-center items-center h-full">
      <Card className="p-4 w-100 mx-auto mt-20">
        <H1>{t("title")}</H1>
        <Input
          placeholder={t("email")}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          placeholder={t("password")}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error ? <p className="text-sm text-red-500">{error}</p> : null}
        <Button onClick={handleLogin} disabled={isLoading}>
          {t("loginButton")}
        </Button>
      </Card>
      ß
    </div>
  );
}
