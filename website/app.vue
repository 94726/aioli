<script setup lang="ts"></script>

<template>
  <div>
    <ClientOnly>
      <ADialogRoot allow-mouse-drag>
        <div class="w-50 pt-64 flex flex-col items-center">
          <h1 class="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl">
            Aioli
          </h1>
          <div class="columns-2">
            <ADialogTrigger
              class="inline-flex items-center justify-center px-5 py-2 text-base font-medium text-center border-2 rounded-lg hover:bg-gray-100"
            >
              Open Dialog
            </ADialogTrigger>
            <a
              class="py-2 px-4 flex justify-center items-center bg-gray-600 hover:bg-gray-700 focus:ring-gray-500 focus:ring-offset-gray-200 text-white text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg"
              href="https://github.com/94726/aioli"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="currentColor"
                class="mr-2"
                viewBox="0 0 1792 1792"
              >
                <path
                  d="M896 128q209 0 385.5 103t279.5 279.5 103 385.5q0 251-146.5 451.5t-378.5 277.5q-27 5-40-7t-13-30q0-3 .5-76.5t.5-134.5q0-97-52-142 57-6 102.5-18t94-39 81-66.5 53-105 20.5-150.5q0-119-79-206 37-91-8-204-28-9-81 11t-92 44l-38 24q-93-26-192-26t-192 26q-16-11-42.5-27t-83.5-38.5-85-13.5q-45 113-8 204-79 87-79 206 0 85 20.5 150t52.5 105 80.5 67 94 39 102.5 18q-39 36-49 103-21 10-45 15t-57 5-65.5-21.5-55.5-62.5q-19-32-48.5-52t-49.5-24l-20-3q-21 0-29 4.5t-5 11.5 9 14 13 12l7 5q22 10 43.5 38t31.5 51l10 23q13 38 44 61.5t67 30 69.5 7 55.5-3.5l23-4q0 38 .5 88.5t.5 54.5q0 18-13 30t-40 7q-232-77-378.5-277.5t-146.5-451.5q0-209 103-385.5t279.5-279.5 385.5-103zm-477 1103q3-7-7-12-10-3-13 2-3 7 7 12 9 6 13-2zm31 34q7-5-2-16-10-9-16-3-7 5 2 16 10 10 16 3zm30 45q9-7 0-19-8-13-17-6-9 5 0 18t17 7zm42 42q8-8-4-19-12-12-20-3-9 8 4 19 12 12 20 3zm57 25q3-11-13-16-15-4-19 7t13 15q15 6 19-6zm63 5q0-13-17-11-16 0-16 11 0 13 17 11 16 0 16-11zm58-10q-2-11-18-9-16 3-14 15t18 8 14-14z"
                />
              </svg>
              Github
            </a>
          </div>
        </div>
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
    <div class="w-20 m-auto" />
  </div>
</template>

<style></style>
