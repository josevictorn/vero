import { builtinModules } from "node:module";
import swc from "unplugin-swc";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

const external = [
  ...builtinModules,
  ...builtinModules.map((moduleName) => `node:${moduleName}`),
];

export default defineConfig({
  plugins: [
    tsconfigPaths(),
    swc.vite({
      jsc: {
        parser: {
          syntax: "typescript",
          decorators: true,
        },
        transform: {
          legacyDecorator: true,
          decoratorMetadata: true,
        },
      },
      module: { type: "es6" },
    }),
  ],
  build: {
    target: "node22",
    outDir: "dist",
    emptyOutDir: true,
    sourcemap: true,
    ssr: "src/infra/main.ts",
    rollupOptions: {
      external,
      output: {
        entryFileNames: "main.js",
      },
    },
  },
});
