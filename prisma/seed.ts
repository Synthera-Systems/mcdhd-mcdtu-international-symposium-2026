// --- prisma/seed.ts ---
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.systemSettings.upsert({
    where: { id: 1 },
    update: {},
    create: {
      symposiumDates: "July 26 - 27, 2026",
      earlyRegistrationDeadline: "2026-08-15",
      lateRegistrationDeadline: "2026-09-30",
      notificationDate: "2026-07-05",
      accountName: "STATE BANK OF INDIA",
      bankName: "REGISTRAR TEZPUR UNIVERSITY",
      accountNumber: "37844754976",
      ifscCode: "SBIN0007505",
      upiQrUrl: "",
    },
  });
  console.log("Database parameters successfully initialized!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });