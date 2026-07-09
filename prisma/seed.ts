// --- prisma/seed.ts ---
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  await prisma.systemSettings.upsert({
    where: { id: 1 },
    update: {},
    create: {
      symposiumDates: "October 26 - 27, 2026",
      submissionDeadline: "Oct 15, 2026",
      notificationDate: "Nov 01, 2026",
      accountName: "MitoCan-Symposium 2026",
      bankName: "State Bank of India",
      accountNumber: "98765432101",
      ifscCode: "SBIN0001234",
      upiQrUrl: ""
    },
  });
  console.log("Database parameters successfully initialized!");
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());