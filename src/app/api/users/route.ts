import { NextRequest, NextResponse } from "next/server";
import { getPrismaClient } from "@/lib/prisma";
import { ensureAuthenticated } from "@/lib/auth";
import bcrypt from "bcryptjs";

type CreateUserBody = {
  email: string;
  password: string;
  name: string;
};

type UpdateUserBody = {
  id: string;
  email: string;
  name: string;
};

export async function GET(request: NextRequest) {
  try {
    const authError = await ensureAuthenticated(request);
    if (authError) {
      return authError;
    }

    const users = await getPrismaClient().user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json(
      { error: "An error occurred while fetching users" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const authError = await ensureAuthenticated(request);
    if (authError) {
      return authError;
    }

    const body = (await request.json()) as CreateUserBody;

    const email = body.email;
    const password = body.password;
    const name = body.name;

    if (!email || !email.trim() || !password || !name || !name.trim()) {
      return NextResponse.json(
        { error: "email, password and name are required" },
        { status: 400 },
      );
    }

    const existingUser = await getPrismaClient().user.findUnique({
      where: { email: email.trim() },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email already in use" },
        { status: 400 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await getPrismaClient().user.create({
      data: {
        email: email.trim(),
        password: hashedPassword,
        name: name.trim(),
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "An error occurred while creating the user" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const authError = await ensureAuthenticated(request);
    if (authError) {
      return authError;
    }

    const body = (await request.json()) as UpdateUserBody;

    const id = body.id;
    const email = body.email;
    const name = body.name;

    if (!id || !email || !email.trim() || !name || !name.trim()) {
      return NextResponse.json(
        { error: "id, email and name are required" },
        { status: 400 },
      );
    }

    const existingUser = await getPrismaClient().user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userWithEmail = await getPrismaClient().user.findUnique({
      where: { email: email.trim() },
    });

    if (userWithEmail && userWithEmail.id !== id) {
      return NextResponse.json(
        { error: "Email already in use by another user" },
        { status: 400 },
      );
    }

    const updatedUser = await getPrismaClient().user.update({
      where: { id },
      data: {
        name: name.trim(),
        email: email.trim(),
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    return NextResponse.json(
      { error: "An error occurred while updating the user" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const authError = await ensureAuthenticated(request);
    if (authError) {
      return authError;
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    await getPrismaClient().user.delete({
      where: { id },
    });

    return NextResponse.json({ message: "User deleted" });
  } catch (error: unknown) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2025"
    ) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      { error: "An error occurred while deleting the user" },
      { status: 500 },
    );
  }
}
