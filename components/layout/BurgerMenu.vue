<script setup lang="ts">
import { computed, onMounted, onUnmounted, watch } from 'vue'
import { useNavigationStore } from '~/stores/navigationStore'
import type { INavItem } from '~/types/NavigationStore'

/** Props for BurgerMenu component */
interface Props {
  /** Controls menu visibility */
  modelValue: boolean
  /** Side of the screen to slide from */
  side?: 'left' | 'right'
  /** Menu items to display (optional for slot-based usage) */
  menuItems?: INavItem[]
}

const props = withDefaults(defineProps<Props>(), {
  side: 'right',
  menuItems: undefined,
})

/** Emit for updating modelValue */
const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

/** Initialize router and navigation store for active route tracking */
const route = useRoute()
const navigationStore = useNavigationStore()

/** Two-way binding for menu visibility */
const isOpen = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v),
})

/** Close the menu */
function close() {
  isOpen.value = false
}

/** Handle Escape key to close menu */
function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') close()
}

/** Setup and cleanup event listeners */
onMounted(() => {
  window.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown)
})

/** Check if route or any of its children is active */
const isActiveOrParent = (item: INavItem): boolean => {
  return (
    navigationStore.isRouteActive(item.href) ||
    (item.children ? navigationStore.isParentActive(item.href) : false)
  )
}

/** Handle navigation link click */
const handleNavClick = () => {
  close()
  // Navigation will be handled by NuxtLink
}

/** Sync current route with store on mount and route changes */
watch(
  () => route.path,
  (newPath) => {
    navigationStore.setCurrentRoute(newPath)
  },
  { immediate: true }
)
</script>

<template>
  <!-- Overlay -->
  <Transition name="fade">
    <div
      v-if="isOpen"
      class="fixed inset-0 bg-black/40 z-40"
      @click="close"
    />
  </Transition>

  <!-- Slide panel -->
  <Transition name="slide">
    <aside
      v-if="isOpen"
      class="fixed mt-4 w-72 bg-neutral-900 z-50 shadow-xl"
      :class="side === 'left' ? 'left-0' : 'right-0'"
      role="dialog"
      aria-modal="true"
    >
      <!-- Menu items from store -->
      <div v-if="menuItems" class="text-lg font-medium space-y-0 bg-neutral-900 border-b border-neutral-700">
        <template v-for="item in menuItems" :key="item.href">
          <!-- Menu item without children -->
          <NuxtLink
            v-if="!item.children"
            :to="item.href"
            class="block px-6 py-3 text-neutral-100 hover:bg-neutral-700 transition-colors duration-200 min-h-[44px] flex items-center"
            :class="{ active: isActiveOrParent(item) }"
            @click="handleNavClick()"
          >
            {{ item.label }}
          </NuxtLink>

          <!-- Menu item with children (submenu) -->
          <details v-else class="group px-3 py-1">
            <summary class="cursor-pointer px-3 py-3 text-neutral-100 hover:bg-neutral-700 transition-colors duration-200 min-h-[44px] flex items-center font-medium" :class="{ active: isActiveOrParent(item) }">
              {{ item.label }}
            </summary>
            <!-- Submenu items -->
            <nav class="bg-neutral-800 py-2 space-y-0">
              <NuxtLink
                v-for="child in item.children"
                :key="child.href"
                :to="child.href"
                class="block px-9 py-2 text-sm text-neutral-300 hover:text-neutral-100 hover:bg-neutral-700 transition-colors duration-200 min-h-[44px] flex items-center"
                :class="{
              active: navigationStore.isRouteActive(child.href),
            }"
                @click="handleNavClick()"
              >
                {{ child.label }}
              </NuxtLink>
            </nav>
          </details>
        </template>
      </div>

      <!-- Fallback to slot if no menuItems provided -->
      <slot v-else />
    </aside>
  </Transition>
</template>

<style scoped>
/* Fade overlay transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Slide panel transition */
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.25s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}

.active {
  @apply text-accent-400;
  border-bottom-color: theme('colors.accent.400');
}
</style>
