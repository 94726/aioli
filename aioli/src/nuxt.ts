import { addComponent, defineNuxtModule, createResolver } from '@nuxt/kit'

import type {} from '@nuxt/schema' // workaround for TS bug with "phantom" deps
// import { components as allComponents } from '../../../radix-vue/constant/components'

export interface ModuleOptions {
  prefix: string
  installStyles: boolean
}

function getComponents() {
  return [
    'DialogClose',
    'DialogContent',
    'DialogDescription',
    'DialogOverlay',
    'DialogPortal',
    'DialogRoot',
    'DialogTitle',
    'DialogTrigger',
  ]
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'aioli/nuxt',
    configKey: 'aioli',
    compatibility: {
      nuxt: '^3.0.0',
    },
  },
  defaults: {
    prefix: 'A',
    installStyles: true,
  },
  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url)
    for (const component of getComponents()) {
      addComponent({
        name: `${options.prefix}${component}`,
        export: component,
        filePath: resolver.resolve('./index'),
      })
    }

    if (options.installStyles) {
      nuxt.options.css.push(resolver.resolve('./styles.css'))
    }
  },
})
