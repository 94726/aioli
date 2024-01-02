<template>
  <DialogOverlay ref="overlayNode" :aioli-visible="visible" aioli-overlay="">
    <slot />
  </DialogOverlay>
</template>

<script setup lang="ts">
import { type ComponentPublicInstance, nextTick, ref, watch } from 'vue'
import { useDrawerContext } from './context'
import { DialogOverlay } from 'radix-vue'

const { overlayRef, openProp, visible } = useDrawerContext()!
const overlayNode = ref<ComponentPublicInstance>()
watch(
  openProp,
  async () => {
    await nextTick() // wait for mount
    const el = overlayNode.value?.$el
    if (el instanceof HTMLDivElement) overlayRef.value = el
  },
  { immediate: true },
)
</script>
