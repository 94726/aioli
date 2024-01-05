import { provide, inject, type InjectionKey, type Ref } from 'vue'

interface DrawerContextValue {
  drawerRef: Ref<HTMLDivElement | undefined>
  overlayRef: Ref<HTMLDivElement | undefined>
  onPress: (event: PointerEvent) => void
  onRelease: (event: PointerEvent) => void
  onDrag: (event: PointerEvent) => void
  persistent: Ref<Readonly<boolean>>
  openProp: Ref<boolean>
  keyboardIsOpen: Ref<boolean>
  modal: Ref<Readonly<boolean>>
  visible: Ref<boolean>
  allowMouseDrag: Ref<boolean>
}

const DrawerContext = Symbol('drawerContext') as InjectionKey<DrawerContextValue>

export function provideDrawerContext(value: DrawerContextValue) {
  return provide(DrawerContext, value)
}

export const useDrawerContext = () => inject(DrawerContext)
