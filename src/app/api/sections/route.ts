import { NextRequest, NextResponse } from "next/server";
import { getPrismaClient } from "@/lib/prisma";
import { ensureAuthenticated } from "@/lib/auth";

type CreateSectionBody = {
  name: string;
  title: string;
  content: string;
  order: number;
  show?: boolean;
  images: string[];
};

type UpdateSectionBody = {
  id: string;
  name: string;
  title: string;
  content: string;
  order: number;
  show: boolean;
  images: string[];
};

export async function POST(request: NextRequest) {
  try {
    const authResponse = await ensureAuthenticated(request);
    if (authResponse instanceof NextResponse) {
      return authResponse;
    }

    const body = (await request.json()) as CreateSectionBody;

    const name = body.name.trim();
    const title = body.title.trim();
    const content = body.content.trim();
    const order = body.order;
    const show = body.show ?? true;
    const rawImages = body.images;

    if (
      rawImages !== undefined &&
      (!Array.isArray(rawImages) ||
        !rawImages.every((img): img is string => typeof img === "string"))
    ) {
      return NextResponse.json({ error: "invalidImage" }, { status: 400 });
    }

    const images = rawImages ?? [];

    if (!name) {
      return NextResponse.json({ error: "emptyName" }, { status: 400 });
    }

    if (!title) {
      return NextResponse.json({ error: "emptyTitle" }, { status: 400 });
    }

    if (!content) {
      return NextResponse.json({ error: "emptyContent" }, { status: 400 });
    }

    if (order === undefined) {
      return NextResponse.json({ error: "emptyOrder" }, { status: 400 });
    }

    if (!Number.isInteger(order) || order < 0) {
      return NextResponse.json({ error: "invalidOrder" }, { status: 400 });
    }

    const section = await getPrismaClient().section.create({
      data: {
        name,
        title,
        content,
        order,
        show,
        images: {
          create: images.map((url, index) => ({ url, order: index })),
        },
      },
      include: {
        images: true,
      },
    });

    return NextResponse.json(section, { status: 201 });
  } catch (error: unknown) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2002"
    ) {
      return NextResponse.json({ error: "takenName" }, { status: 409 });
    }

    return NextResponse.json({ error: "createError" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const sections = await getPrismaClient().section.findMany({
      orderBy: { order: "asc" },
      include: {
        images: {
          orderBy: { order: "asc" },
        },
      },
    });

    return NextResponse.json(sections, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "getError" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const authResponse = await ensureAuthenticated(request);
    if (authResponse instanceof NextResponse) {
      return authResponse;
    }

    const body = (await request.json()) as UpdateSectionBody;

    const id = body.id;
    const name = body.name.trim();
    const title = body.title.trim();
    const content = body.content.trim();
    const order = body.order;
    const show = body.show ?? true;
    const rawImages = body.images;
    if (
      rawImages !== undefined &&
      (!Array.isArray(rawImages) ||
        !rawImages.every((img): img is string => typeof img === "string"))
    ) {
      return NextResponse.json({ error: "invalidImage" }, { status: 400 });
    }

    const images = rawImages ?? [];

    if (!id) {
      return NextResponse.json({ error: "emptyId" }, { status: 400 });
    }

    if (!name) {
      return NextResponse.json({ error: "emptyName" }, { status: 400 });
    }

    if (!title) {
      return NextResponse.json({ error: "emptyTitle" }, { status: 400 });
    }

    if (!content) {
      return NextResponse.json({ error: "emptyContent" }, { status: 400 });
    }

    if (order === undefined) {
      return NextResponse.json({ error: "emptyOrder" }, { status: 400 });
    }

    if (!Number.isInteger(order) || order < 0) {
      return NextResponse.json({ error: "invalidOrder" }, { status: 400 });
    }

    const section = await getPrismaClient().section.update({
      where: { id },
      data: {
        name,
        title,
        content,
        order,
        show,
        images: {
          deleteMany: {},
          create: images.map((url, index) => ({ url, order: index })),
        },
      },
      include: {
        images: true,
      },
    });

    return NextResponse.json(section, { status: 200 });
  } catch (error: unknown) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2025"
    ) {
      return NextResponse.json({ error: "unknownSection" }, { status: 404 });
    }
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2002"
    ) {
      return NextResponse.json({ error: "takenName" }, { status: 409 });
    }

    return NextResponse.json({ error: "updateError" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const authResponse = await ensureAuthenticated(request);
    if (authResponse instanceof NextResponse) {
      return authResponse;
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "emptyId" }, { status: 400 });
    }

    await getPrismaClient().section.delete({
      where: { id },
    });

    return NextResponse.json({ message: "successDeleted" });
  } catch (error: unknown) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2025"
    ) {
      return NextResponse.json({ error: "unknownSection" }, { status: 404 });
    }

    return NextResponse.json({ error: "deleteError" }, { status: 500 });
  }
}
