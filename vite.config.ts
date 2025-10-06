// Use dynamic imports inside the exported async function to avoid
// Node attempting to require() ESM-only modules when the config
// is loaded in a CommonJS environment (CI). Vite supports an
// async function that returns the config object.
export default async () => {
  const { defineConfig } = await import("vite")
  const reactPlugin = (await import("@vitejs/plugin-react")).default
  const path = await import("path")

  return defineConfig({
    plugins: [reactPlugin()],
    root: path.join(__dirname, "src/renderer"),
    base: "./",
    build: {
      outDir: path.join(__dirname, "dist/renderer"),
      emptyOutDir: true,
    },
    server: {
      port: 5173,
    },
  })
}
