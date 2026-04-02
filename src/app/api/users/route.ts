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
    const authResult = await ensureAuthenticated(request);
    if (authResult instanceof NextResponse) {
      return authResult;
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
    return NextResponse.json({ error: "getError" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const authResult = await ensureAuthenticated(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const body = (await request.json()) as CreateUserBody;

    const email = body.email;
    const password = body.password;
    const name = body.name;

    if (!email) {
      return NextResponse.json({ error: "emptyEmail" }, { status: 400 });
    }

    if (!password) {
      return NextResponse.json({ error: "emptyPassword" }, { status: 400 });
    }

    if (!name) {
      return NextResponse.json({ error: "emptyName" }, { status: 400 });
    }

    const existingUser = await getPrismaClient().user.findUnique({
      where: { email: email.trim() },
    });

    if (existingUser) {
      return NextResponse.json({ error: "takenEmail" }, { status: 400 });
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
    return NextResponse.json({ error: "createError" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const authResult = await ensureAuthenticated(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const body = (await request.json()) as UpdateUserBody;

    const id = body.id;
    const email = body.email;
    const name = body.name;

    if (!id) {
      return NextResponse.json({ error: "emptyId" }, { status: 400 });
    }
    if (!email) {
      return NextResponse.json({ error: "emptyEmail" }, { status: 400 });
    }
    if (!name) {
      return NextResponse.json({ error: "emptyName" }, { status: 400 });
    }

    const existingUser = await getPrismaClient().user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return NextResponse.json({ error: "unknownUser" }, { status: 404 });
    }

    const userWithEmail = await getPrismaClient().user.findUnique({
      where: { email: email.trim() },
    });

    if (userWithEmail && userWithEmail.id !== id) {
      return NextResponse.json({ error: "takenEmail" }, { status: 400 });
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

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "updateError" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const authResult = await ensureAuthenticated(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "emptyId" }, { status: 400 });
    }

    await getPrismaClient().user.delete({
      where: { id },
    });

    return NextResponse.json({ message: "successDeleted" }, { status: 200 });
  } catch (error: unknown) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2025"
    ) {
      return NextResponse.json({ error: "unknownUser" }, { status: 404 });
    }

    return NextResponse.json({ error: "deleteError" }, { status: 500 });
  }
}
