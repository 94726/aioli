<script setup lang="ts">
import { vAutoAnimate } from '@/auto-animate'

const dialogOpen = ref(false)
const showExamples = ref(false)

function getExampleSourceUrl(name: string) {
  return `https://github.com/94726/aioli/blob/main/website/app/components/example/${name}.vue`
}

const examples = [
  {
    buttonText: 'Open System-Tray',
    source: getExampleSourceUrl('ExampleSystemTray'),
    component: resolveComponent('LazyExampleSystemTray'),
  },
]
</script>

<template>
  <div class="w-50 pt-64 flex flex-col items-center">
    <h1 class="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl">
      Aioli
    </h1>
    <div class="columns-2">
      <button
        class="inline-flex items-center justify-center px-5 py-2 text-base font-medium text-center border-2 rounded-lg hover:bg-gray-100"
        @click="dialogOpen = true"
      >
        Open Dialog
      </button>
      <a
        class="py-2 px-4 flex justify-center items-center bg-gray-600 hover:bg-gray-700 focus:ring-gray-500 focus:ring-offset-gray-200 text-white text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg"
        href="https://github.com/94726/aioli"
      >
        <GithubIcon />
        Github
      </a>
    </div>
    <div v-auto-animate="{ duration: 200 }" class="mt-2 flex flex-col gap-2 align-center">
      <button class="text-slate-600 underline" @click="showExamples = !showExamples">Show More Examples</button>
      <div v-if="showExamples">
        <template v-for="example in examples" :key="example.source">
          <component :is="example.component">
            <div class="flex border-[2px] rounded-[0.75rem] bg-gray-600 has-[[github]:hover]:bg-gray-700">
              <ADialogTrigger
                class="bg-white inline-flex items-center rounded-[calc(0.75rem_-_2px)] border-2 m-[-2px] justify-center px-5 py-2 text-base font-medium text-center hover:bg-gray-100 focus:z-10"
              >
                {{ example.buttonText }}
              </ADialogTrigger>
              <a
                github
                title="See source"
                target="_blank"
                class="py-2 px-4 flex justify-center items-center focus-visible:ring-gray-500 focus-visible:ring-offset-gray-200 text-white text-center text-base font-semibold shadow-md outline-none focus-visible:ring-2 focus-visible:ring-offset-2 rounded-lg"
                :href="example.source"
              >
                <GithubIcon />
              </a>
            </div>
          </component>
        </template>
      </div>
    </div>
    <ClientOnly>
      <ADialogRoot v-model:open="dialogOpen" allow-mouse-drag>
        <ADialogPortal>
          <ADialogOverlay class="fixed inset-0 bg-black/40" />
          <ADialogContent
            class="fixed flex flex-col bg-white border border-gray-200 border-b-none rounded-t-[10px] bottom-0 left-0 right-0 h-full max-h-[93%] mx-[-1px]"
          >
            <div class="p-4 bg-white rounded-t-[10px] flex-1">
              <div class="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-gray-300 mb-8" />
              <div class="max-w-md mx-auto">
                <h2 class="font-medium mb-4">Drawer for Vue.</h2>
                <p class="text-gray-600 mb-2">
                  This component is a port of the lovely React-Library
                  <a href="https://github.com/emilkowalski/vaul" class="underline" target="_blank">Vaul</a>
                  by
                  <a href="https://emilkowal.ski/" class="underline" target="_blank">Emil Kowalski</a>.
                </p>
              </div>
            </div>
          </ADialogContent>
        </ADialogPortal>
      </ADialogRoot>
    </ClientOnly>
  </div>
</template>
