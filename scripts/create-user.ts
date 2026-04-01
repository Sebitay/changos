import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

type CliOptions = {
  email?: string;
  name?: string;
  password?: string;
  updateIfExists: boolean;
};

function parseArgs(argv: string[]): CliOptions {
  const options: CliOptions = { updateIfExists: false };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    const next = argv[i + 1];

    if (arg === "--email" && next) {
      options.email = next;
      i += 1;
      continue;
    }

    if (arg === "--name" && next) {
      options.name = next;
      i += 1;
      continue;
    }

    if (arg === "--password" && next) {
      options.password = next;
      i += 1;
      continue;
    }

    if (arg === "--update-if-exists") {
      options.updateIfExists = true;
    }
  }

  return options;
}

function printUsage(): void {
  console.log(
    "Usage: npm run user:create -- --email <email> --name <name> --password <password> [--update-if-exists]",
  );
}

async function main(): Promise<void> {
  const { email, name, password, updateIfExists } = parseArgs(
    process.argv.slice(2),
  );

  if (!email || !name || !password) {
    printUsage();
    process.exitCode = 1;
    return;
  }

  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not defined in the environment.");
  }

  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
  const prisma = new PrismaClient({ adapter });

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    const hashedPassword = await bcrypt.hash(password, 10);

    if (existingUser && !updateIfExists) {
      console.error(
        `User with email ${email} already exists. Pass --update-if-exists to update name/password.`,
      );
      process.exitCode = 1;
      return;
    }

    if (existingUser && updateIfExists) {
      const updatedUser = await prisma.user.update({
        where: { email },
        data: {
          name,
          password: hashedPassword,
        },
      });

      console.log(`Updated user: ${updatedUser.email}`);
      return;
    }

    const createdUser = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    });

    console.log(`Created user: ${createdUser.email}`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error: unknown) => {
  console.error("Failed to create user.");
  if (error instanceof Error) {
    console.error(error.message);
  } else {
    console.error(error);
  }
  process.exit(1);
});
