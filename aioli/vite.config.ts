import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    dts({
      cleanVueFileName: true,
    }),
  ],
  build: {
    cssCodeSplit: true,
    lib: {
      name: 'aioli',
      entry: ['src/index.ts', 'src/nuxt.ts', 'src/styles.css'],
    },
    minify: false,
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library (Vue)
      external: ['vue', 'radix-vue', '@nuxt/kit'],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          vue: 'Vue',
        },
        assetFileNames: (chunkInfo) => {
          return chunkInfo.name as string
        },
      },
    },
  },
})
