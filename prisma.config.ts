import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  // 只保留基础的 datasource 配置，不要添加 engineType 或 adapter
  datasource: {
    url: process.env.DATABASE_URL,
  },
});
