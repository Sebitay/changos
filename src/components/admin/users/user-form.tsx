"use client";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldGroup } from "@/components/ui/field";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { User, CreateUserInput, UpdateUserInput } from "@/app/types";

type CreateProps = {
  type: "create";
  user?: never;
  onSubmit: (data: CreateUserInput) => Promise<User>;
  onCancel: () => void;
  onSuccess?: () => unknown | Promise<unknown>;
};

type EditProps = {
  type: "edit";
  user: UpdateUserInput;
  onSubmit: (data: UpdateUserInput) => Promise<User>;
  onCancel: () => void;
  onSuccess?: () => unknown | Promise<unknown>;
};

type Props = CreateProps | EditProps;

export function UserForm(_props: Props) {
  const t = useTranslations("UserForm");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    if (_props.type === "create") {
      const payload: CreateUserInput = {
        name: String(formData.get("name") ?? ""),
        email: String(formData.get("email") ?? ""),
        password: String(formData.get("password") ?? ""),
      };
      await _props.onSubmit(payload);
      await _props.onSuccess?.();
      _props.onCancel();
      return;
    }

    const payload: UpdateUserInput = {
      id: _props.user.id,
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
    };
    await _props.onSubmit(payload);
    await _props.onSuccess?.();
    _props.onCancel();
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>
          {t(_props.type === "create" ? "titleCreate" : "titleEdit")}
        </DialogTitle>
        <DialogDescription>
          {t(
            _props.type === "create" ? "descriptionCreate" : "descriptionEdit",
          )}
        </DialogDescription>
      </DialogHeader>

      <form
        id={_props.type === "create" ? "create-user-form" : "edit-user-form"}
        onSubmit={(e) => {
          void handleSubmit(e);
        }}
      >
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="name">{t("name")}</FieldLabel>
            <Input
              id="name"
              name="name"
              defaultValue={_props.user?.name || ""}
              required
              minLength={2}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="email">{t("email")}</FieldLabel>
            <Input
              id="email"
              name="email"
              type="email"
              defaultValue={_props.user?.email || ""}
              required
            />
          </Field>
          {_props.type === "create" && (
            <>
              <Field>
                <FieldLabel htmlFor="password">{t("password")}</FieldLabel>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  defaultValue={""}
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="confirm-password">
                  {t("confirmPassword")}
                </FieldLabel>
                <Input
                  id="confirm-password"
                  name="confirmPassword"
                  type="password"
                  defaultValue={""}
                />
              </Field>
            </>
          )}
        </FieldGroup>
      </form>

      <DialogFooter>
        <Button variant="outline" onClick={_props.onCancel}>
          {t("cancelButton")}
        </Button>
        <Button
          type="submit"
          form={
            _props.type === "create" ? "create-user-form" : "edit-user-form"
          }
        >
          {t("submitButton")}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
