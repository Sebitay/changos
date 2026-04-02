"use client";
import { useEffect, useState } from "react";
import { useGetUsers, useCreateUser } from "@/app/hooks/useUser";
import { useUserColumns } from "@/components/admin/users/table/columns";
import { useTranslations } from "next-intl";
import { UserTable } from "@/components/admin/users/table/data-table";
import { Button } from "@/components/ui/button";
import { UserForm } from "@/components/admin/users/user-form";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";

export default function AdminPage() {
  const [openForm, setOpenForm] = useState(false);
  const { users, loading, fetchUsers } = useGetUsers();
  const { createUser } = useCreateUser();
  const columns = useUserColumns(fetchUsers);
  const t = useTranslations("AdminUser");

  useEffect(() => {
    void fetchUsers();
  }, [fetchUsers]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <UserTable columns={columns} data={users} />
      <div className="mt-4 flex justify-end">
        <Dialog open={openForm} onOpenChange={setOpenForm}>
          <DialogTrigger asChild>
            <Button>{t("create")}</Button>
          </DialogTrigger>
          <UserForm
            type="create"
            onSubmit={createUser}
            onCancel={() => setOpenForm(false)}
            onSuccess={fetchUsers}
          />
        </Dialog>
      </div>
    </div>
  );
}
