"use client";
import { useTranslations } from "next-intl";
import { ColumnDef } from "@tanstack/react-table";
import { User } from "@/app/types";
import { ActionButton } from "./action-button";

export const useUserColumns = (
  onChanged?: () => unknown | Promise<unknown>,
): ColumnDef<User>[] => {
  const t = useTranslations("AdminUser");

  return [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "name",
      header: t("name"),
    },
    {
      accessorKey: "email",
      header: t("email"),
    },
    {
      accessorKey: "createdAt",
      header: t("createdAt"),
      cell: ({ getValue }) => {
        const date = new Date(getValue() as string);
        return date.toLocaleDateString();
      },
    },
    {
      accessorKey: "updatedAt",
      header: t("updatedAt"),
      cell: ({ getValue }) => {
        const date = new Date(getValue() as string);
        return date.toLocaleDateString();
      },
    },
    {
      accessorKey: "actions",
      header: "",
      cell: ({ row }) => {
        return (
          <div className="flex justify-end">
            <ActionButton user={row.original} onChanged={onChanged} />
          </div>
        );
      },
    },
  ];
};
