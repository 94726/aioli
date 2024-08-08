<script setup lang="ts">
import autoAnimate, { getTransitionSizes } from '@/auto-animate'
const dialogOpen = ref(false)
const showPrivateKey = ref(false)
const showRecoveryPhase = ref(false)
const showRemoveWallet = ref(false)

const el = ref()

function initAutoAnimate() {
  autoAnimate(el.value, (el, action, oldCoords, newCoords) => {
    let easing = 'linear'
    let keyframes: Keyframe[] = []

    if (action === 'add') {
      keyframes = [{ opacity: 0 }, { opacity: 1 }]
    } else if (action === 'remove') {
      keyframes = [{ opacity: 1 }, { opacity: 0, offset: 2 / 3 }, { opacity: 0 }]
    } else if (action === 'remain') {
      const [widthFrom, widthTo, heightFrom, heightTo] = getTransitionSizes(el, oldCoords!, newCoords!)
      const start: Keyframe = {}
      const end: Keyframe = {}

      if (widthFrom !== widthTo) {
        start.width = `${widthFrom}px`
        end.width = `${widthTo}px`
      }
      if (heightFrom !== heightTo) {
        start.height = `${heightFrom}px`
        end.height = `${heightTo}px`
      }

      keyframes = [start, end]
      easing = 'ease-out'
    }

    return new KeyframeEffect(el, keyframes, { duration: 150, easing })
  })
}
</script>

<template>
  <ClientOnly>
    <ADialogRoot v-model:open="dialogOpen" allow-mouse-drag>
      <slot />
      <ADialogPortal>
        <ADialogOverlay class="fixed inset-0 bg-black/40" />
        <ADialogContent
          class="text-slate-500 fixed inset-x-4 bottom-4 mx-auto max-w-[360px] overflow-hidden rounded-[36px] bg-[#FEFFFE] outline-none md:w-full"
          @transitionend="initAutoAnimate()"
        >
          <div ref="el" class="px-6 pb-6 pt-2.5">
            <ADialogClose
              class="absolute top-[32px] right-[32px] z-10 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-[#949595] transition-transform focus:scale-95 focus-visible:shadow-focus-ring-button active:scale-75"
              type="button"
            >
              <Icon name="pepicons:times" size="24" />
            </ADialogClose>
            <div v-if="showPrivateKey">
              <div class="px-2">
                <header class="pt-5 border-b border-slate-200 pb-6">
                  <div class="h-[48px]">
                    <Icon name="uil:keyhole-circle" size="48" />
                  </div>

                  <h2 class="mt-2.5 text-[22px] font-semibold text-slate-800 md:font-medium">Private Key</h2>
                  <p class="mt-3 text-[17px] font-medium leading-[24px] md:font-normal">
                    Your Private Key is the key used to back up your wallet. Keep it secret and secure at all times.
                  </p>
                </header>
                <ul class="mt-6 space-y-4">
                  <li class="flex items-center gap-3 text-[15px] font-semibold md:font-medium">
                    <Icon name="uil:shield-check" size="24" />
                    Keep your Secret Phrase safe
                  </li>
                  <li class="flex items-center gap-3 text-[15px] font-semibold md:font-medium">
                    <Icon name="uil:file-landscape-alt" size="24" />
                    Don’t share it with anyone else
                  </li>
                  <li class="flex items-center gap-3 text-[15px] font-semibold md:font-medium">
                    <Icon name="uil:times-circle" size="24" />
                    If you lose it, we can’t recover it
                  </li>
                </ul>
              </div>
              <div class="mt-7 flex gap-4">
                <button
                  class="flex h-12 w-full items-center justify-center gap-4 rounded-full text-center text-[19px] font-semibold transition-transform focus:scale-95 focus-visible:shadow-focus-ring-button active:scale-95 md:font-medium bg-gray-100 text-slate-800"
                  @click="showPrivateKey = false"
                >
                  Cancel
                </button>
                <button
                  class="flex h-12 w-full items-center justify-center gap-4 rounded-full text-center text-[19px] font-semibold transition-transform focus:scale-95 focus-visible:shadow-focus-ring-button active:scale-95 md:font-medium bg-sky-500 text-[#FFFFFF]"
                  @click="showPrivateKey = false"
                >
                  <svg
                    viewBox="0 0 30 30"
                    width="20"
                    fill="none"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-miterlimit="10"
                    stroke="currentColor"
                  >
                    <path d="  M12.062,20c0.688,0.5,1.688,1,2.938,1s2.25-0.5,2.938-1" />
                    <line x1="20" x2="20" y1="12" y2="14" />
                    <line x1="10" x2="10" y1="12" y2="14" />
                    <path d="M15,12  v4c0,0.552-0.448,1-1,1" />
                    <g stroke-width="3">
                      <path d="M26,9   V6c0-1.105-0.895-2-2-2h-3" />
                      <path d="M9,4   H6C4.895,4,4,4.895,4,6v3" />
                      <path d="   M21,26h3c1.105,0,2-0.895,2-2v-3" />
                      <path d="M4,21   v3c0,1.105,0.895,2,2,2h3" />
                    </g>
                  </svg>
                  Reveal
                </button>
              </div>
            </div>
            <div v-else-if="showRecoveryPhase">
              <div class="px-2">
                <header class="pt-[21px] border-b border-slate-200 pb-6">
                  <div class="h-[48px]">
                    <Icon name="uil:eye" size="48" />
                  </div>

                  <h2 class="mt-2.5 text-[22px] font-semibold text-slate-800 md:font-medium">Secret Recovery Phrase</h2>
                  <p class="mt-3 text-[17px] font-medium leading-[24px] md:font-normal">
                    Your Secret Recovery Phrase is the key used to back up your wallet. Keep it secret at all times.
                  </p>
                </header>
                <ul class="mt-6 space-y-4">
                  <li class="flex items-center gap-3 text-[15px] font-semibold md:font-medium">
                    <Icon name="uil:shield-check" size="24" />
                    Keep your Secret Phrase safe
                  </li>
                  <li class="flex items-center gap-3 text-[15px] font-semibold md:font-medium">
                    <Icon name="uil:file-landscape-alt" size="24" />
                    Don’t share it with anyone else
                  </li>
                  <li class="flex items-center gap-3 text-[15px] font-semibold md:font-medium">
                    <Icon name="uil:times-circle" size="24" />
                    If you lose it, we can’t recover it
                  </li>
                </ul>
              </div>
              <div class="mt-7 flex gap-4">
                <button
                  class="flex h-12 w-full items-center justify-center gap-[15px] rounded-full text-center text-[19px] font-semibold transition-transform focus:scale-95 focus-visible:shadow-focus-ring-button active:scale-95 md:font-medium bg-gray-100 text-slate-800"
                  @click="showRecoveryPhase = false"
                >
                  Cancel
                </button>
                <button
                  class="flex h-12 w-full items-center justify-center gap-[15px] rounded-full text-center text-[19px] font-semibold transition-transform focus:scale-95 focus-visible:shadow-focus-ring-button active:scale-95 md:font-medium bg-sky-500 text-[#FFFFFF]"
                  @click="showRecoveryPhase = false"
                >
                  <svg
                    viewBox="0 0 30 30"
                    width="20"
                    fill="none"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-miterlimit="10"
                    stroke="currentColor"
                  >
                    <path d="  M12.062,20c0.688,0.5,1.688,1,2.938,1s2.25-0.5,2.938-1" />
                    <line x1="20" x2="20" y1="12" y2="14" />
                    <line x1="10" x2="10" y1="12" y2="14" />
                    <path d="M15,12  v4c0,0.552-0.448,1-1,1" />
                    <g stroke-width="3">
                      <path d="M26,9   V6c0-1.105-0.895-2-2-2h-3" />
                      <path d="M9,4   H6C4.895,4,4,4.895,4,6v3" />
                      <path d="   M21,26h3c1.105,0,2-0.895,2-2v-3" />
                      <path d="M4,21   v3c0,1.105,0.895,2,2,2h3" />
                    </g>
                  </svg>
                  Reveal
                </button>
              </div>
            </div>
            <div v-else-if="showRemoveWallet">
              <div class="px-2">
                <header class="pt-[21px]">
                  <div class="h-[48px]">
                    <Icon name="uil:exclamation-circle" mode="css" class="text-[#FF3F3F]" size="48" />
                  </div>
                  <h2 class="mt-2.5 text-[22px] font-semibold text-slate-800 md:font-medium">Are you sure?</h2>
                </header>
                <p class="mt-3 text-[17px] font-medium leading-[24px] md:font-normal">
                  You haven’t backed up your wallet yet. If you remove it, you could lose access forever. We suggest
                  tapping and backing up your wallet first with a valid recovery method.
                </p>
              </div>
              <div class="mt-7 flex gap-4">
                <button
                  class="flex h-12 w-full items-center justify-center gap-[15px] rounded-full text-center text-[19px] font-semibold transition-transform focus:scale-95 focus-visible:shadow-focus-ring-button active:scale-95 md:font-medium bg-gray-100 text-slate-800"
                  @click="showRemoveWallet = false"
                >
                  Cancel
                </button>
                <button
                  class="flex h-12 w-full items-center justify-center gap-[15px] rounded-full text-center text-[19px] font-semibold transition-transform focus:scale-95 focus-visible:shadow-focus-ring-button active:scale-95 md:font-medium bg-[#FF3F40] text-[#FFFFFF]"
                  @click="showRemoveWallet = false"
                >
                  Continue
                </button>
              </div>
            </div>
            <div v-else>
              <header class="mb-4 flex h-[72px] items-center border-b border-slate-200 pl-2">
                <h2 class="text-[19px] font-semibold text-slate-800 md:font-medium">Options</h2>
              </header>
              <div class="flex flex-col gap-3 text-slate-800 text-[17px]">
                <button
                  class="flex h-12 items-center gap-4 rounded-2xl bg-gray-100 px-4 font-semibold transition-transform focus:scale-95 focus-visible:shadow-focus-ring-button active:scale-95 md:font-medium"
                  @click="showPrivateKey = true"
                >
                  <Icon name="uil:lock" size="24" class="text-gray-500" />
                  View Private Key
                </button>
                <button
                  class="flex h-12 items-center gap-4 rounded-2xl bg-gray-100 px-4 font-semibold transition-transform focus:scale-95 focus-visible:shadow-focus-ring-button active:scale-95 md:font-medium"
                  @click="showRecoveryPhase = true"
                >
                  <Icon name="uil:file-landscape-alt" size="24" class="text-gray-500" />
                  View Recovery Phase
                </button>
                <button
                  class="flex h-12 items-center gap-4 rounded-2xl bg-red-50 px-4 font-semibold text-[#FF3F40] transition-transform focus:scale-95 focus-visible:shadow-focus-ring-button active:scale-95 md:font-medium"
                  @click="showRemoveWallet = true"
                >
                  <Icon name="uil:exclamation-triangle" size="22" />
                  Remove Wallet
                </button>
              </div>
            </div>
          </div>
        </ADialogContent>
      </ADialogPortal>
    </ADialogRoot>
  </ClientOnly>
</template>

<style scoped>
[aioli-drawer] {
  transition: transform 0.2s cubic-bezier(0.165, 0.84, 0.44, 1);
}

[aioli-overlay] {
  transition: opacity 0.2s cubic-bezier(0.165, 0.84, 0.44, 1);
}
</style>
