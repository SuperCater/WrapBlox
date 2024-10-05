import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  target: "esnext",
  format: ["esm"], // Build for commonJS and ESmodules
  dts: {
	resolve : true,
	entry: "src/index.ts",
  }, // Generate declaration file (.d.ts)
  splitting: true,
  sourcemap: true,
  clean: true,
});