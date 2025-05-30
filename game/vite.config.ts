import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig, loadEnv } from 'vite'

export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd())

  const HOST = env.VITE_SERVER_HOST ?? undefined
  const PORT = parseInt(env.VITE_SERVER_PORT) ?? undefined

  return defineConfig({
    plugins: [tsconfigPaths()],
    server: {
      host: HOST,
      port: PORT
    }
  })
}
