import { NextResponse } from "next/server";
import { getPrismaClient } from "@/lib/prisma";

type CreateSectionBody = {
  name?: string;
  title?: string;
  content?: string;
  order?: number;
  show?: boolean;
  images?: string[];
};

type UpdateSectionBody = {
  id: string;
  name?: string;
  title?: string;
  content?: string;
  order?: number;
  show?: boolean;
  images?: string[];
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CreateSectionBody;

    const name = body.name?.trim();
    const title = body.title?.trim();
    const content = body.content?.trim();
    const order = body.order;
    const show = body.show ?? true;
    const images = body.images ?? [];

    if (!name || !title || !content || !order) {
      return NextResponse.json(
        { error: "name, title, content and order are required" },
        { status: 400 },
      );
    }

    if (!Number.isInteger(order) || order < 0) {
      return NextResponse.json(
        { error: "order is required and must be an integer >= 0" },
        { status: 400 },
      );
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
      return NextResponse.json(
        { error: "section name already exists" },
        { status: 409 },
      );
    }

    return NextResponse.json(
      { error: "failed to create section" },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    const sections = await getPrismaClient().section.findMany({
      orderBy: { order: "asc" },
    });

    return NextResponse.json(sections);
  } catch (error) {
    return NextResponse.json(
      { error: "failed to fetch sections" },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = (await request.json()) as UpdateSectionBody;

    const id = body.id;
    const name = body.name?.trim();
    const title = body.title?.trim();
    const content = body.content?.trim();
    const order = body.order;
    const show = body.show ?? true;
    const images = body.images ?? [];

    if (!name || !title || !content || !order) {
      return NextResponse.json(
        { error: "name, title, content and order are required" },
        { status: 400 },
      );
    }

    if (!Number.isInteger(order) || order < 0) {
      return NextResponse.json(
        { error: "order is required and must be an integer >= 0" },
        { status: 400 },
      );
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

    return NextResponse.json(section);
  } catch (error: unknown) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2025"
    ) {
      return NextResponse.json({ error: "section not found" }, { status: 404 });
    }

    return NextResponse.json(
      { error: "failed to update section" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get("name");

    if (!name) {
      return NextResponse.json({ error: "name is required" }, { status: 400 });
    }

    await getPrismaClient().section.delete({
      where: { name },
    });

    return NextResponse.json({ message: "section deleted" });
  } catch (error: unknown) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2025"
    ) {
      return NextResponse.json({ error: "section not found" }, { status: 404 });
    }

    return NextResponse.json(
      { error: "failed to delete section" },
      { status: 500 },
    );
  }
}
