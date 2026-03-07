import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        reporters: ["tree"],
        globals: true, // Agar tidak perlu import describe, it, expect di tiap file
        environment: "node",
        setupFiles: ["./tests/setup.ts"],
        silent: true
    },
});
