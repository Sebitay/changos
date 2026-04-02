"use client";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { EllipsisVertical, Trash2, Pen } from "lucide-react";
import { useTranslations } from "next-intl";
import { useDeleteUser } from "@/app/hooks/useUser";
import { User } from "@/app/types";
import { Dialog } from "@/components/ui/dialog";
import { UserForm } from "@/components/admin/users/user-form";
import { useUpdateUser } from "@/app/hooks/useUser";

interface ActionButtonProps {
  user: User;
  onChanged?: () => unknown | Promise<unknown>;
}

export function ActionButton({ user, onChanged }: ActionButtonProps) {
  const [editOpen, setEditOpen] = useState(false);
  const { deleteUser } = useDeleteUser();
  const { updateUser } = useUpdateUser();
  const t = useTranslations("AdminUser");

  const handleDelete = async () => {
    await deleteUser(user.id);
    await onChanged?.();
  };

  return (
    <Dialog open={editOpen} onOpenChange={setEditOpen}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <EllipsisVertical />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-40">
          <DropdownMenuItem onSelect={() => setEditOpen(true)}>
            <Pen />
            {t("edit")}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={() => {
              void handleDelete();
            }}
            className="text-red-500"
          >
            <Trash2 />
            {t("delete")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <UserForm
        type="edit"
        user={user}
        onSubmit={updateUser}
        onCancel={() => setEditOpen(false)}
        onSuccess={onChanged}
      />
    </Dialog>
  );
}
