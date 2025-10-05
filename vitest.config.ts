import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    include: ["**/*.test.{ts,tsx}"],
    coverage: {
      provider: "v8"
    }
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "apps/web"),
      "@quillborn/ui": path.resolve(__dirname, "packages/ui/src"),
      "@quillborn/types": path.resolve(__dirname, "packages/types/src")
    }
  }
});
