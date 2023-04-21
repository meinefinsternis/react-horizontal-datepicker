import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import sassDts from "vite-plugin-sass-dts";
import typescript from "@rollup/plugin-typescript";
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";
import autoprefixer from "autoprefixer";

const resolvePath = (str) => path.resolve(__dirname, str);

export default defineConfig({
  esbuild: {
    drop: ["console", "debugger"],
  },
  build: {
    sourcemap: false,
    cssTarget: ["es2019", "edge88", "firefox78", "chrome87", "safari13.1"],
    lib: {
      entry: resolvePath("src/index.ts"),
      formats: ["cjs"],
      fileName: () => "index.js",
    },
    rollupOptions: {
      external: ["react", "react-dom"],
      output: {
        globals: {
          react: "React",
        },
      },
    },
  },
  css: {
    postcss: {
      plugins: [autoprefixer()],
    },
    modules: {
      generateScopedName: "[hash:base64:2]",
    },
  },
  plugins: [
    react(),
    typescript(),
    cssInjectedByJsPlugin({ styleId: "__DATEPICKER__" }),
    sassDts({
      enabledMode: ["development", "production"],
    }),
  ],
});
