<template>
  <DialogContent
    ref="contentNode"
    v-bind="props"
    aioli-drawer
    :aioli-visible="visible"
    @open-auto-focus="
      (e) => {
        emit('openAutoFocus', e)
        e.preventDefault()
        drawerRef?.focus?.()
      }
    "
    @pointer-down-outside="
      (e) => {
        if (!modal || e.detail.originalEvent.button != 0) {
          e.preventDefault()
          return
        }
        if (keyboardIsOpen) {
          keyboardIsOpen = false
        }
        e.preventDefault()

        if (persistent) return

        openProp = false
        emit('pointerDownOutside', e)
      }
    "
    @interact-outside="emit('interactOutside', $event)"
    v-on="maybeMouseEvents"
    @touchstart.passive="onPress"
    @touchmove.passive="onDrag"
    @touchend.passive="onRelease"
  >
    <slot />
  </DialogContent>
</template>

<script setup lang="ts">
import { DialogContent, type DialogContentProps, type DialogContentEmits } from 'radix-vue'
import { ref, watch, type ComponentPublicInstance, nextTick, computed } from 'vue'
import { useDrawerContext } from './context'

const props = defineProps<DialogContentProps>()
const emit = defineEmits<DialogContentEmits>()

const { drawerRef, onPress, onRelease, onDrag, persistent, keyboardIsOpen, visible, openProp, modal, allowMouseDrag } =
  useDrawerContext()!

const contentNode = ref<ComponentPublicInstance>()

watch(
  openProp,
  async () => {
    await nextTick() // wait for mount
    const el = contentNode.value?.$el
    if (el instanceof HTMLDivElement) drawerRef.value = el
  },
  { immediate: true },
)

const maybeMouseEvents = computed(() => {
  if (!allowMouseDrag.value) return {}

  return {
    pointerdown: onPress,
    pointermove: onDrag,
    pointerup: onRelease,
  }
})
</script>
