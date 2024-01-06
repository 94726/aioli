<template>
  <DialogRoot
    :open="dialogMounted"
    :modal="modal"
    @update:open="
      (open) => {
        openProp = open
      }
    "
  >
    <slot />
  </DialogRoot>
</template>

<script setup lang="ts">
import { useEventListener, useVModel } from '@vueuse/core'
import { DialogRoot, type DialogRootProps } from 'radix-vue'
import { nextTick, onMounted, ref, toRefs, watch } from 'vue'
import { provideDrawerContext } from './context'
import { dampenValue, getTranslateY, isInput, set } from './helpers'

const VELOCITY_THRESHOLD = 0.4

const CLOSE_THRESHOLD = 0.25

const SCROLL_LOCK_TIMEOUT = 100

const WINDOW_TOP_OFFSET = 26

const DRAG_CLASS = 'aioli-dragging'

type DialogProps = {
  open?: boolean
  closeThreshold?: number
  scrollLockTimeout?: number
  fixed?: boolean
  persistent?: boolean
  modal?: boolean
  cancellableClosing?: boolean
  allowMouseDrag?: boolean
} & DialogRootProps

const props = withDefaults(defineProps<DialogProps>(), {
  closeThreshold: CLOSE_THRESHOLD,
  scrollLockTimeout: SCROLL_LOCK_TIMEOUT,
  persistent: false,
  modal: true,
  snapPoints: () => [],
  cancellableClosing: true,
})

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
  (e: 'release', event: PointerEvent, open: boolean): void
  (e: 'close'): void
}>()

const { closeThreshold, scrollLockTimeout, persistent, fixed, modal, cancellableClosing, allowMouseDrag } =
  toRefs(props)

const openProp = useVModel(props, 'open', undefined, { passive: true })
const dialogMounted = ref(false)

const hasBeenOpened = ref(false)
// Not visible = translateY(100%)
const visible = ref(false)
const isDragging = ref(false)
const justReleased = ref(false)
const overlayRef = ref<HTMLDivElement>()
const dragStartTime = ref<Date | null>(null)
const dragEndTime = ref<Date | null>(null)
let lastTimeDragPrevented: Date | null = null
const isAllowedToDrag = ref(false)
const pointerStartY = ref(0)
const keyboardIsOpen = ref(false)
const previousDiffFromInitial = ref(0)
const drawerRef = ref<HTMLDivElement>()
const drawerHeightRef = ref(0)
const initialDrawerHeight = ref(0)

provideDrawerContext({
  visible,
  drawerRef,
  overlayRef,
  onPress,
  onRelease,
  onDrag,
  persistent,
  openProp,
  keyboardIsOpen,
  modal,
  allowMouseDrag,
})

onMounted(() => {
  watch(
    openProp,
    () => {
      if (openProp.value) {
        dialogMounted.value = true
        hasBeenOpened.value = true
        nextTick(() => (visible.value = true)) // wait for drawer to be mounted
      } else {
        visible.value = false
        if (!drawerRef.value) return

        const hasTransition = getComputedStyle(drawerRef.value).transition != 'all 0s ease 0s'

        if (!hasTransition) {
          dialogMounted.value = false
          return
        }

        // make sure not to catch the onDrag (transitioncancel)
        requestAnimationFrame(() => {
          let stopTransitioncancelListener: undefined | (() => void)

          const stopTransitionendListener = useEventListener(drawerRef, 'transitionend', (e: Event) => {
            if (e.target != e.currentTarget) return
            dialogMounted.value = false
            stopTransitioncancelListener?.()
            stopTransitionendListener?.()
          })

          if (cancellableClosing.value) {
            stopTransitioncancelListener = useEventListener(drawerRef, 'transitioncancel', (e: Event) => {
              if (e.target != e.currentTarget) return
              visible.value = true
              openProp.value = true
              stopTransitioncancelListener?.()
              stopTransitionendListener?.()
            })
          }
        })
      }
    },
    { immediate: true },
  )

  watch(visible, (visible) => {
    if (!visible) return
    const children = drawerRef.value?.querySelectorAll('*')
    children?.forEach((child: Element) => {
      const htmlChild = child as HTMLElement
      if (htmlChild.scrollHeight > htmlChild.clientHeight || htmlChild.scrollWidth > htmlChild.clientWidth) {
        htmlChild.classList.add('aioli-scrollable')
      }
    })
  })
})

useEventListener(window.visualViewport, 'resize', function onVisualViewportChange() {
  if (!drawerRef.value) return

  const focusedElement = document.activeElement as HTMLElement
  if (isInput(focusedElement) || keyboardIsOpen.value) {
    const visualViewportHeight = window.visualViewport?.height || 0
    // This is the height of the keyboard
    const diffFromInitial = window.innerHeight - visualViewportHeight
    const drawerHeight = drawerRef.value.getBoundingClientRect().height || 0
    if (!initialDrawerHeight.value) {
      initialDrawerHeight.value = drawerHeight
    }
    const offsetFromTop = drawerRef.value.getBoundingClientRect().top

    // visualViewport height may change due to some subtle changes to the keyboard. Checking if the height changed by 60 or more will make sure that they keyboard really changed its open state.
    if (Math.abs(previousDiffFromInitial.value - diffFromInitial) > 60) {
      keyboardIsOpen.value = !keyboardIsOpen.value
    }

    previousDiffFromInitial.value = diffFromInitial
    // We don't have to change the height if the input is in view, when we are here we are in the opened keyboard state so we can correctly check if the input is in view
    if (drawerHeight > visualViewportHeight || keyboardIsOpen.value) {
      const height = drawerRef.value.getBoundingClientRect().height
      let newDrawerHeight = height

      if (height > visualViewportHeight) {
        newDrawerHeight = visualViewportHeight - WINDOW_TOP_OFFSET
      }
      // When fixed, don't move the drawer upwards if there's space, but rather only change it's height so it's fully scrollable when the keyboard is open
      if (fixed.value) {
        drawerRef.value.style.height = `${height - Math.max(diffFromInitial, 0)}px`
      } else {
        drawerRef.value.style.height = `${Math.max(newDrawerHeight, visualViewportHeight - offsetFromTop)}px`
      }
    } else {
      drawerRef.value.style.height = `${initialDrawerHeight.value}px`
    }

    // Negative bottom value would never make sense
    drawerRef.value.style.bottom = `${Math.max(diffFromInitial, 0)}px`
  }
})

// function getScale() {
//   return (window.innerWidth - WINDOW_TOP_OFFSET) / window.innerWidth
// }

function resetDrawerStyles() {
  if (!drawerRef.value) return
  // const currentSwipeAmount = getTranslateY(drawerRef.value)

  set(drawerRef.value, {
    transform: '',
    transition: '',
  })

  set(overlayRef.value, {
    transition: '',
    '--drag-percent': '',
  })
}

function shouldDrag(el: EventTarget, isDraggingUp: boolean) {
  let element = el as HTMLElement
  const date = new Date()
  const highlightedText = window.getSelection()?.toString()
  const swipeAmount = (drawerRef.value ? getTranslateY(drawerRef.value) : null) ?? 0
  if (swipeAmount > 0) {
    return true
  }
  // todo this part is bit annoying
  // Don't drag if there's highlighted text
  if (highlightedText && highlightedText.length > 0) {
    return false
  }

  // Disallow dragging if drawer was scrolled within `scrollLockTimeout`
  if (
    lastTimeDragPrevented &&
    date.getTime() - lastTimeDragPrevented.getTime() < scrollLockTimeout.value &&
    swipeAmount === 0
  ) {
    lastTimeDragPrevented = date
    return false
  }

  // Keep climbing up the DOM tree as long as there's a parent
  while (element) {
    // Check if the element is scrollable
    if (element.scrollHeight > element.clientHeight) {
      // user is trying to scroll down
      if (isDraggingUp && ['scroll', 'auto'].includes(getComputedStyle(element).overflowY)) {
        lastTimeDragPrevented = date
        // We are dragging down so we should allow scrolling
        return false
      }
      if (element.scrollTop !== 0) {
        lastTimeDragPrevented = new Date()
        return false // The element is scrollable and not scrolled to the top, so don't drag
      }

      if (element.getAttribute('role') === 'dialog') {
        return true
      }
    }

    // Move up to the parent element
    element = element.parentNode as HTMLElement
  }
  // No scrollable parents not scrolled to the top found, so drag
  return true
}

let dragStartY = 0
function onPress(event: PointerEvent) {
  if (!allowMouseDrag.value && event.pointerType === 'mouse') return
  if (!cancellableClosing.value && !openProp.value) return // Don't allow dragging if the drawer is closed and cancellableClosing is false
  if (persistent.value || isDragging.value) return
  if (drawerRef.value && !drawerRef.value.contains(event.target as Node)) return
  drawerHeightRef.value = drawerRef.value?.getBoundingClientRect().height || 0
  isDragging.value = true
  dragStartTime.value = new Date()

  // Ensure we maintain correct pointer capture even when going outside of the drawer
  ;(event.target as HTMLElement).setPointerCapture(event.pointerId)
  pointerStartY.value = event.screenY
  dragStartY = getTranslateY(drawerRef.value!) ?? 0 // get current translate e.g. intercepting a close animation
  resetDrawerStyles()
  onDrag(event) // transition cancelling shouldn't require mouse movement
}

function onDrag(event: PointerEvent) {
  if (!allowMouseDrag.value && event.pointerType === 'mouse') return
  // We need to know how much of the drawer has been dragged in percentages so that we can transform background accordingly
  if (isDragging.value) {
    const y = event.screenY

    const draggedDistance = pointerStartY.value - y - dragStartY
    const isDraggingUp = draggedDistance > 0

    if (!draggedDistance) return // not dragging yet
    if (!isAllowedToDrag.value && !shouldDrag(event.target!, isDraggingUp)) return

    drawerRef.value?.classList.add(DRAG_CLASS)
    overlayRef.value?.classList.add(DRAG_CLASS)
    // If shouldDrag gave true once after pressing down on the drawer, we set isAllowedToDrag to true and it will remain true until we let go, there's no reason to disable dragging mid way, ever, and that's the solution to it
    isAllowedToDrag.value = true

    set(drawerRef.value, {
      transition: 'none',
    })

    set(overlayRef.value, {
      transition: 'none',
    })

    // todo this still triggers, on scrollable, scrolledtop containers, when dragging the modal down and then up again shortly after
    // drag overflow
    if (draggedDistance > 0) {
      const dampenedDraggedDistance = dampenValue(draggedDistance)
      set(drawerRef.value, {
        transform: `translate3d(0, ${Math.min(dampenedDraggedDistance * -1, 0)}px, 0)`,
      })
      return
    }

    // We need to capture last time when drag with scroll was triggered and have a timeout between
    const absDraggedDistance = Math.abs(draggedDistance)

    const dragPercent = absDraggedDistance / drawerHeightRef.value

    set(drawerRef.value, {
      transform: `translate3d(0, ${absDraggedDistance}px, 0)`,
    })

    set(
      overlayRef.value,
      {
        '--drag-percent': `${1 - dragPercent}`,
      },
      true,
    )
  }
}

function onRelease(event: PointerEvent) {
  if (!allowMouseDrag.value && event.pointerType === 'mouse') return
  if (!drawerRef.value) return
  const swipeAmount = getTranslateY(drawerRef.value)

  resetDrawerStyles()
  drawerRef.value?.classList.remove(DRAG_CLASS)
  overlayRef.value?.classList.remove(DRAG_CLASS)

  if (!isDragging.value) return
  if (isAllowedToDrag.value && isInput(event.target as HTMLElement)) {
    // If we were just dragging, prevent focusing on inputs etc. on release
    ;(event.target as HTMLInputElement).blur()
  }

  isAllowedToDrag.value = false
  isDragging.value = false
  dragEndTime.value = new Date()

  if (!shouldDrag(event.target!, false) || !swipeAmount || Number.isNaN(swipeAmount)) return

  if (dragStartTime.value === null) return

  const timeTaken = dragEndTime.value.getTime() - dragStartTime.value.getTime()
  const distMoved = pointerStartY.value - event.screenY
  const velocity = Math.abs(distMoved) / timeTaken
  const visibleDrawerHeight = Math.min(drawerRef.value.getBoundingClientRect().height ?? 0, window.innerHeight)

  if (velocity > 0.05) {
    // `justReleased` is needed to prevent the drawer from focusing on an input when the drag ends, as it's not the intent most of the time.
    justReleased.value = true

    setTimeout(() => {
      justReleased.value = false
    }, 200)
  }

  // Moved upwards, don't do anything
  if (distMoved > 0) {
    openProp.value = true
  } else if (velocity > VELOCITY_THRESHOLD) {
    openProp.value = false
  } else if (swipeAmount >= visibleDrawerHeight * closeThreshold.value) {
    openProp.value = false
  }

  emit('release', event, openProp.value)
}
</script>
