import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    // This is exclusively utilized by the Prisma CLI for migrations
    url: env("DATABASE_URL"),
  },
});