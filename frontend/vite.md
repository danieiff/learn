## Typescript
- `tsc --noEmit` for prod
- `tsc --noEmit --watch` for dev or https://github.com/fi3ework/vite-plugin-checker
- Use Type-Only Imports and Exports to avoid to bundle type
import type { T } from 'only/types'
- tsconfig.json
```json
compilerOptions: {
  isolatedModules: true // because esbuild only transpile without type information
  // "skipLibCheck": true // necessary for libs like 'vue'
  useDefineForClassFields: true // Vite's default (ts/js specific and esnext standard)
  // Set to false, if any libs doesn't work with this
  // Also be careful `extends` `importsNotUsedAsValues` `preserveValueImports` `jsxFactory` `jsxFragmentFactory`

}
```
- Client types /// <reference types="vite/client" /> Add 'vite/client' to compilerOptions.types'
  This supports
  - Asset imports (e.g. importing an .svg file)
  - Types for the Vite-injected env variables on import.meta.env
  - Types for the HMR API on import.meta.hot

Override default typings
```vite-env-override.d.ts (the file that contains your typings):
declare module '*.svg' {
  const content: React.FC<React.SVGProps<SVGElement>>
  export default content
}
```
The file containing the reference to vite/client:
Add /// <reference types="./vite-env-override.d.ts" /> before `/// <refere...`


## CSS
- Importing .css files will inject its content to the page via a `<style>` tag with HMR support. You can also retrieve the processed CSS as a string as the module's default export.
- `.module.css` file -> `css.modules` option
If `css.modules.localsConvention` set to enable camelCase locals (e.g. localsConvention: 'camelCaseOnly'), you can also use named imports:
```ts
// import classes from './example.module.css' ↓
import { applyColor } from './example.module.css' // .apply-color -> applyColor
document.getElementById('foo').className = applyColor


import styles from './bar.css?inline' // <- returns just string not injected css
```

## Assets
- public/assets will be copied to dist as-is.
- You should always reference public assets using root absolute path - for example, public/icon.png should be referenced in source code as /icon.png.
- Assets in public cannot be imported from JavaScript.
- `import.meta.env.BASE_URL` is replaced public base path during build.
  `import.meta.env['BASE_URL']` won't work. any `import.meta.env.*` must be literal

```ts
const imgUrl = new URL('./img.png', import.meta.url).href
document.getElementById('hero-img').src = imgUrl
```
`import.meta.url` is different between browser and server (doesn't work on SSR)


## JSON `import json /* ->entire obj or { field } -> root field */ from './example.json'`


## Glob Import
```ts
const modules = import.meta.glob('./dir/*.js') 
// First arg: glob literal or in array, '!' followed by glob will be excluded, alias
// Second arg
// { eager: true } to disable dynamic import
// { as: 'raw' } to import as string, or 'url' as url
// { import: 'named_import' } -> './foo.js': () => import('./foo.js').then((m) => m.named_import),
// { query: {key: value, ... } } any params used by any plugins

// transforms to

const modules = {
  './dir/foo.js': () => import('./dir/foo.js'),
  './dir/bar.js': () => import('./dir/bar.js'),
}

// iterate to use modules, lazy-loaded (dynamic import), split into chunks on build

for (const path in modules) {
  modules[path]().then((mod) => {
    console.log(path, mod)
  })
}
```


## Dynamic Import
`const module = await import(`./dir/${file}.js`)` variable for file names one level deep


## Web Assembly
Pre-compiled .wasm files can be imported with ?init
```ts
import init from './example.wasm?init'

init(/* { imports: { someFunc: () => {}, } */)
// optional `imports` obj passed to `WebAssembly.instantiate` as the second arg
.then((instance) => { instance.exports.test() })
```


## Web Worker
```ts
// A web worker script can be imported using new Worker() and new SharedWorker()
const worker = new Worker(new URL('./worker.js', import.meta.url) /* { type: 'module' } */ )

import MyWorker from './worker?worker'
const worker = new MyWorker()
```


## Plugin
```vite.config.js
import image from '@rollup/plugin-image'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    {
      ...image(), // falsy value(plugin) is ignored
      enforce: 'pre',
      // apply: 'build' // 'serve' (only apply during)
    },
  ],
})
```
API: https://vitejs.dev/guide/api-plugin.html


## Monorepo
Dependencies outside requires the linked dep to be exported as ESM.
Or add deps to `optimizeDeps.include` and `build.commonjsOptions.include`([''/deps/'
, 'node_modules' ]), then run cli with `--force` to take effect changes in linked deps

npm pack on the linked dependency to fix deduplication in runtime

`optimizeDeps.esbuildOptions,.include,.exclude` is for large or Common.js dep. Otherwise, let it be and let browser bundle it.
And for imports which are not directly discoverable in the source code


## Cache
cache stored in `node_modules/.vite`
If you want to debug your dependencies by making local edits, you can:
1. Temporarily disable cache via the Network tab of your browser devtools;
2. Restart Vite dev server with the --force flag to re-bundle the deps;
3. Reload the page.


## Config
```js
export default defineConfig(({ command, mode, ssrBuild }) => { // async ok
  const env = loadEnv(mode, process.cwd(), '') // load .env file
  if (command === 'serve') {
    return {
      // dev specific config function
    }
  } else {
    // command === 'build'
    return {
      // build specific config function
    }
  }
})

 build: {
  rollupOptions: {
    // https://rollupjs.org/configuration-options/
    output: {
      manualChinks: // how chunks are split
    }
    },
  },
```

### index vendor chunk split
Put `splitVendorChunkPlugin( /* { cache: SplitVendorChunkCache } */ )` in plugin
`cache.reset()` needs to be called at `buildStart`

### MPA
├── package.json
├── vite.config.js
├── index.html
├── main.js
└── nested
    ├── index.html
    └── nested.js
Set ` input: {
        main: resolve(__dirname, 'index.html'),
        nested: resolve(__dirname, 'nested/index.html'),
      },` in `rollupOptions.input`

### Library Mode
```vite.config.js
import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: resolve(__dirname, 'lib/main.js'),
      name: 'MyLib',
      // the proper extensions will be added
      fileName: 'my-lib',
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ['vue'],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
})

// The entry file would contain exports that can be imported by users of your package:
import Foo from './Foo.vue'
import Bar from './Bar.vue'
export { Foo, Bar }
```
`vite build` produces bundles for es and umd
```package.json (recommended)
{
  "name": "my-lib",
  "type": "module",
  "files": ["dist"],
  "main": "./dist/my-lib.umd.cjs",
  "module": "./dist/my-lib.js",
  "exports": {
    ".": {
      "import": "./dist/my-lib.js",
      "require": "./dist/my-lib.umd.cjs"
    } /* ,  // for multiple entry points
    "./secondary": {
             "import": "./dist/secondary.js",
      "require": "./dist/secondary.cjs"
    } */
  }
}
```

- Shared options https://vitejs.dev/config/shared-options.html
- Server options https://vitejs.dev/config/server-options.html
- Build options https://vitejs.dev/config/build-options.html


## Env Variables
import.meta.env.*  MODE('development'|'production'), BASE_URL, PROD, DEV, SSR
These will be like '%MODE%' in html file.
Only these literals will be replaced during builds, 'import.meta.env[key]' will not.

- `vite dev` -> 'development' mode, `vite build` -> 'production' mode
- Convention for builds for other than prod:
Set NODE_ENV=development (in the `.env.{mode}`) -> `process.env.NODE_ENV = 'development'`
`vite build --mode staging` overrides mode as 'staging'

Only env variables prefixed with `VITE_` are available in Vite-processed code

### .env files (Higher priority to the bottom)
.env                # loaded in all cases
.env.local          # loaded in all cases, ignored by git
.env.[mode]         # only loaded in specified mode
.env.[mode].local   # only loaded in specified mode, ignored by git

`*.local` should be in .gitignore

```src/env.d.ts
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
```

Hint: Add like `{ "lib": ["WebWorker"] }` to tsconfig.json


## SSR https://vitejs.dev/guide/ssr.html


## Backend Integration https://vitejs.dev/guide/backend-integration.html


## HMR API https://vitejs.dev/guide/api-hmr.html


## JS API https://vitejs.dev/guide/api-javascript.html
