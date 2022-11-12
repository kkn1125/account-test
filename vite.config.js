import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ command, mode, ssrBuild }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    define: {
      __APP_ENV__: env.APP_ENV,
    },
    base: "/",
    mode: "development",
    server: {
      host: "localhost",
      port: 5000,
      watch: {
        usePolling: true,
      },
    },
    resolve: {
      extensions: [".mjs", ".js", ".ts", ".jsx", ".tsx", ".json"],
    },
    logLevel: "info",
    envPrefix: "V_",
  };
});
