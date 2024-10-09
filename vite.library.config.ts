import { extname, relative, resolve } from 'path'
import { fileURLToPath } from 'node:url'
import { glob } from 'glob'
import dts from 'vite-plugin-dts'
// import { libInjectCss } from 'vite-plugin-lib-inject-css'

import type { UserConfig } from 'vite'

const createLibConfig = (): UserConfig => {
  const packageName = 'my-library'
  const packageSrc = `packages/${packageName}/src`

  const libInputs = Object.fromEntries(
    // https://rollupjs.org/configuration-options/#input
    glob.sync(packageSrc + '/**/*.{ts,tsx}').map((file) => [
      // 1. The name of the entry point
      // lib/nested/foo.js becomes nested/foo
      relative(packageSrc, file.slice(0, file.length - extname(file).length)),
      // 2. The absolute path to the entry file
      // lib/nested/foo.ts becomes /project/lib/nested/foo.ts
      fileURLToPath(new URL(file, import.meta.url)),
    ]),
  )

  return {
    plugins: [
      //libInjectCss(),
      dts({ include: [packageSrc] }),
    ],
    build: {
      outDir: `dist/${packageName}`,
      copyPublicDir: false,
      lib: {
        entry: resolve(__dirname, packageSrc),
        formats: ['es'],
      },
      rollupOptions: {
        external: ['react', 'react/jsx-runtime'],
        input: libInputs,
        output: {
          assetFileNames: `assets/[name][extname]`,
          entryFileNames: `[name].js`,
        },
      },
    },
  }
}

export default createLibConfig()
