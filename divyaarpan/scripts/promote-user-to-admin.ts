import { PrismaClient, UserRole } from "@prisma/client";
import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

const prisma = new PrismaClient();

function usage(): never {
  console.error("Usage: npm exec tsx scripts/promote-user-to-admin.ts <email>");
  process.exit(2);
}

async function main() {
  const email = process.argv[2]?.trim().toLowerCase();
  if (!email || !/^\S+@\S+\.\S+$/.test(email)) usage();

  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    throw new Error(`No user found for ${email}. No changes were made.`);
  }

  console.log("User record to modify:");
  console.log(JSON.stringify(user, null, 2));
  console.log("Only the role will change from DEVOTEE to ADMIN. Password and all other data will remain unchanged.");

  if (user.role !== UserRole.DEVOTEE) {
    throw new Error(`Refusing to modify user ${user.id}: current role is ${user.role}, not DEVOTEE.`);
  }

  const readline = createInterface({ input, output });
  try {
    const confirmation = await readline.question('Type "PROMOTE" to continue: ');
    if (confirmation !== "PROMOTE") {
      console.log("Confirmation not received. No changes were made.");
      return;
    }
  } finally {
    readline.close();
  }

  const result = await prisma.user.updateMany({
    where: { id: user.id, email: user.email, role: UserRole.DEVOTEE },
    data: { role: UserRole.ADMIN },
  });

  if (result.count !== 1) {
    throw new Error("The user was changed or removed before promotion. No update was applied.");
  }

  console.log(`User ${user.id} was promoted to ADMIN. No other user was modified.`);
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : "Promotion failed.");
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
