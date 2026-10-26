import { createReadStream, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import type { Plugin } from 'vite'

// Explicit trusted runtime files; no globbing or extra packages are shipped.
const files = [
  'pyodide.mjs',
  'pyodide.asm.mjs',
  'pyodide.asm.wasm',
  'python_stdlib.zip',
  'pyodide-lock.json',
]
export function pythonAssets(base: string): Plugin {
  let isBuild = false
  const source = (file: string) =>
    fileURLToPath(new URL(`../../node_modules/pyodide/${file}`, import.meta.url))
  return {
    name: 'local-python-runtime',
    configResolved(config) {
      isBuild = config.command === 'build'
    },
    buildStart() {
      if (!isBuild) return
      for (const file of files)
        this.emitFile({
          type: 'asset',
          fileName: `runtimes/python/${file}`,
          source: readFileSync(source(file)),
        })
    },
    configureServer(server) {
      server.middlewares.use((request, response, next) => {
        const prefix = `${base}runtimes/python/`
        const pathname = (request.url ?? '').split('?')[0]
        if (!pathname.startsWith(prefix)) return next()
        const file = pathname.slice(prefix.length)
        if (!files.includes(file)) return next()
        const type = file.endsWith('.mjs')
          ? 'text/javascript'
          : file.endsWith('.wasm')
            ? 'application/wasm'
            : file.endsWith('.json')
              ? 'application/json'
              : 'application/zip'
        response.setHeader('Content-Type', type)
        createReadStream(source(file)).pipe(response)
      })
    },
  }
}
