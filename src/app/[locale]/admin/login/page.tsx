"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useLocale, useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { H2 } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel, FieldGroup } from "@/components/ui/field";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("LoginPage");

  async function handleLogin(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    console.log("a");

    setError("");
    setIsLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setIsLoading(false);

    if (result?.error) {
      console.log("error");
      setError(t("errorMessage"));
      return;
    }
    console.log("success");

    router.push(`/${locale}/admin`);
    router.refresh();
  }

  return (
    <div className="flex justify-center items-center h-full">
      <Card className="w-full sm:max-w-md">
        <CardHeader>
          <H2>{t("title")}</H2>
          <CardDescription className="text-red-500">
            {error ? `${error}` : ""}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form id="login-form" onSubmit={handleLogin} className="flex">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="login-email">{t("email")}</FieldLabel>
                <Input
                  id="login-email"
                  placeholder={t("emailPlaceholder")}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="login-password">
                  {t("password")}
                </FieldLabel>
                <Input
                  id="login-password"
                  placeholder={t("passwordPlaceholder")}
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            form="login-form"
            disabled={isLoading}
            className="w-full"
          >
            {t("loginButton")}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
