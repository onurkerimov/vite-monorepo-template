import { extname, relative, resolve, join } from 'path'
import { fileURLToPath } from 'node:url'
import { glob } from 'glob'
import dts from 'vite-plugin-dts'
import { libInjectCss } from 'vite-plugin-lib-inject-css'
import type { UserConfig } from 'vite'
import { getPackagesSync } from '@manypkg/get-packages'
import { viteStaticCopy, Target } from 'vite-plugin-static-copy'
import fs from 'fs'
import fse from 'fs-extra'

const ROOT_DIR = process.cwd()
const PACKAGES_DIR = 'packages'
const TEMP_DIR = 'temp'

const { packages } = getPackagesSync(ROOT_DIR)

const createLibConfig = (): UserConfig => {
  const libInputs = {}
  const copyTargets: Target[] = []

  // Function to add file to copy targets if it exists
  const copyFileIfExists = (filePath: string, relativeDir: string) => {
    if (glob.sync(filePath).length > 0) {
      copyTargets.push({
        src: filePath,
        dest: relative(PACKAGES_DIR, relativeDir),
      })
    }
  }

  packages.forEach((pkg) => {
    const packageSrc = `${pkg.relativeDir}/src`
    glob.sync(packageSrc + '/**/*.{ts,tsx}').map((file) => {
      const key = relative(
        PACKAGES_DIR,
        file.slice(0, file.length - extname(file).length),
      )
      const value = fileURLToPath(new URL(file, import.meta.url))
      libInputs['temp/' + key] = value
    })

    // Add package.json and readme.md to copy targets if they exist
    copyFileIfExists(`${pkg.relativeDir}/package.json`, pkg.relativeDir)
    copyFileIfExists(`${pkg.relativeDir}/readme.md`, pkg.relativeDir)
  })

  return {
    plugins: [
      libInjectCss(),
      dts({
        include: ['packages'],
        outDir: 'dist/temp',
      }),
      viteStaticCopy({
        targets: copyTargets,
      }),
      {
        name: 'post-build-copy',
        closeBundle: () => {
          copyFiles()
        },
      },
    ],
    build: {
      outDir: `dist`,
      copyPublicDir: false,
      lib: {
        entry: resolve(ROOT_DIR, PACKAGES_DIR),
        formats: ['es'],
      },
      rollupOptions: {
        external: (id, parentId, isResolved) => {
          if (!parentId) return false
          if (isResolved) return false
          if (id.charAt(0) === '.') return false
          return true
        },
        input: libInputs,
        output: {
          assetFileNames: (info) => {
            let assetDir = info.originalFileNames?.[0]
            if (assetDir)
              assetDir =
                relative(PACKAGES_DIR, assetDir).replace(/\/[^/]*$/, '') + '/'
            return `temp/${assetDir}[name][extname]`
          },
          entryFileNames: `[name].js`,
        },
      },
    },
  }
}

const copyFiles = () => {
  const sourceDir = join(ROOT_DIR, 'dist', TEMP_DIR)

  // Function to copy files
  function traverse(src: string) {
    fs.readdirSync(src, { withFileTypes: true }).forEach((dirent) => {
      const srcPath = join(src, dirent.name)

      if (dirent.isDirectory()) {
        if (dirent.name === 'src') {
          // Copy all files in the 'src' folder
          fs.readdirSync(srcPath).forEach((file) => {
            const filePath = join(srcPath, file)
            const packageName = relative(
              ROOT_DIR + '/dist/' + TEMP_DIR,
              srcPath,
            ).split('/')[0]
            const destinationFilePath = join(
              ROOT_DIR,
              'dist',
              packageName,
              file,
            )
            fse.copy(filePath, destinationFilePath, { overwrite: true })
          })
        } else {
          // Recursively handle subdirectories
          traverse(srcPath)
        }
      }
    })
  }
  traverse(sourceDir)
}

export default createLibConfig()
