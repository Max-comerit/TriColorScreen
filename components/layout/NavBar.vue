<script setup lang="ts">
/**
 * NavBar Component
 *
 * @description Desktop navigation menu with dropdown support
 * Uses navigationStore for menu items and state management
 */

// ===== IMPORTS =====
import { storeToRefs } from 'pinia'
import { useNavigationStore } from '~/stores/navigationStore'
import type { INavItem } from '~/types/NavigationStore'
import BurgerMenu from './BurgerMenu.vue'
import BurgerButton from './BurgerButton.vue'

// ===== COMPOSABLES & STORES =====
const navigationStore = useNavigationStore()
const { menuItems } = storeToRefs(navigationStore)
const router = useRouter()
const route = useRoute()

// ===== STATE =====
const openDropdown = ref<string | null>(null)
const isTouchDevice = ref(false)
const isBurgerOpen = ref(false)
const navDropdownRefs = ref<Record<string, HTMLElement>>({})

// ===== METHODS =====
/**
 * Toggle dropdown visibility
 */
const toggleDropdown = (href: string): void => {
  openDropdown.value = openDropdown.value === href ? null : href
}

/**
 * Close dropdown
 */
const closeDropdown = (): void => {
  openDropdown.value = null
}

/**
 * Open dropdown (without toggling)
 */
const openDropdownMenu = (href: string): void => {
  openDropdown.value = href
}

/**
 * Handle keyboard interaction for dropdowns
 */
const handleDropdownKeydown = (event: KeyboardEvent, item: INavItem): void => {
  if (!item.children) return

  // Open dropdown on Enter or Space when focused on parent
  if (event.key === 'Enter' || event.key === ' ' || event.code === 'Space') {
    event.preventDefault()
    toggleDropdown(item.href)
  }
  // Close dropdown on Escape
  else if (event.key === 'Escape') {
    closeDropdown()
  }
  // Open dropdown and focus first child on ArrowDown
  else if (event.key === 'ArrowDown') {
    event.preventDefault()
    if (openDropdown.value !== item.href) {
      openDropdownMenu(item.href)
    }
    // Focus first dropdown item
    nextTick(() => {
      const dropdown = (event.target as HTMLElement)
        .closest('.nav-item')
        ?.querySelector('.dropdown-link') as HTMLElement
      dropdown?.focus()
    })
  }
}

/**
 * Handle keyboard navigation within dropdown
 */
const handleDropdownItemKeydown = (
  event: KeyboardEvent,
  _parentHref: string,
  childIndex: number,
  totalChildren: number
): void => {
  // Navigate down with ArrowDown
  if (event.key === 'ArrowDown') {
    event.preventDefault()
    const nextIndex = childIndex + 1
    if (nextIndex < totalChildren) {
      const nextItem = (event.target as HTMLElement)
        .closest('.dropdown-item')
        ?.nextElementSibling?.querySelector('.dropdown-link') as HTMLElement
      nextItem?.focus()
    }
  }
  // Navigate up with ArrowUp
  else if (event.key === 'ArrowUp') {
    event.preventDefault()
    const prevIndex = childIndex - 1
    if (prevIndex >= 0) {
      const prevItem = (event.target as HTMLElement)
        .closest('.dropdown-item')
        ?.previousElementSibling?.querySelector('.dropdown-link') as HTMLElement
      prevItem?.focus()
    } else {
      // Focus back to parent button
      const parentButton = (event.target as HTMLElement)
        .closest('.nav-item')
        ?.querySelector('.nav-link') as HTMLElement
      parentButton?.focus()
    }
  }
  // Close dropdown on Escape and return focus to parent
  else if (event.key === 'Escape') {
    event.preventDefault()
    closeDropdown()
    const parentButton = (event.target as HTMLElement)
      .closest('.nav-item')
      ?.querySelector('.nav-link') as HTMLElement
    parentButton?.focus()
  }
  // Navigate to next top-level item on ArrowRight
  else if (event.key === 'ArrowRight') {
    event.preventDefault()
    closeDropdown()
    const currentNavItem = (event.target as HTMLElement).closest('.nav-item')
    const nextNavItem = currentNavItem?.nextElementSibling
    const nextNavLink = nextNavItem?.querySelector('.nav-link') as HTMLElement
    nextNavLink?.focus()
  }
  // Navigate to previous top-level item on ArrowLeft
  else if (event.key === 'ArrowLeft') {
    event.preventDefault()
    closeDropdown()
    const currentNavItem = (event.target as HTMLElement).closest('.nav-item')
    const prevNavItem = currentNavItem?.previousElementSibling
    const prevNavLink = prevNavItem?.querySelector('.nav-link') as HTMLElement
    prevNavLink?.focus()
  }
}

/**
 * Handle keyboard navigation for top-level nav items
 */
const handleNavKeydown = (event: KeyboardEvent): void => {
  const currentNavItem = (event.target as HTMLElement).closest('.nav-item')

  // Navigate right with ArrowRight
  if (event.key === 'ArrowRight') {
    event.preventDefault()
    closeDropdown()
    const nextNavItem = currentNavItem?.nextElementSibling
    const nextNavLink = nextNavItem?.querySelector('.nav-link') as HTMLElement
    nextNavLink?.focus()
  }
  // Navigate left with ArrowLeft
  else if (event.key === 'ArrowLeft') {
    event.preventDefault()
    closeDropdown()
    const prevNavItem = currentNavItem?.previousElementSibling
    const prevNavLink = prevNavItem?.querySelector('.nav-link') as HTMLElement
    prevNavLink?.focus()
  }
}

/**
 * Handle focus leaving the nav item (close dropdown if focus moves outside)
 */
const handleNavItemFocusOut = (event: FocusEvent): void => {
  const navItem = event.currentTarget as HTMLElement
  const relatedTarget = event.relatedTarget as HTMLElement

  // Check if the new focus target is still within this nav item
  if (!relatedTarget || !navItem.contains(relatedTarget)) {
    closeDropdown()
  }
}

/**
 * Handle focus leaving the nav item (safari issue fix)
 */
const handleOutsidePointer = (event: PointerEvent) => {
  // Check if click/tap is inside the currently open dropdown
  const openHref = openDropdown.value
  if (!openHref) return

  const dropdownEl = navDropdownRefs.value[openHref]
  if (!dropdownEl?.contains(event.target as Node)) {
    closeDropdown()
  }
}

/**
 * Handle mouse enter on nav item
 */
const handleMouseEnter = (item: INavItem): void => {
  if (!isTouchDevice.value && item.children) {
    openDropdownMenu(item.href)
  }
}

/**
 * Handle mouse leave on nav item
 */
const handleMouseLeave = (): void => {
  if (!isTouchDevice.value) {
    closeDropdown()
  }
}

/**
 * Handle focus on nav item (open dropdown for keyboard navigation)
 */
const handleNavFocus = (item: INavItem): void => {
  if (!isTouchDevice.value && item.children) {
    openDropdownMenu(item.href)
  }
}

/**
 * Handle navigation to a route
 * The watcher will update the store when route changes
 */
const handleNavigation = async (href: string): Promise<void> => {
  closeDropdown()
  await router.push(href)
}

/**
 * Handle click on nav item (toggle dropdown for items with children, navigate for items without)
 */
const handleNavClick = async (event: Event, item: INavItem): Promise<void> => {
  if (item.children) {
    event.preventDefault()
    // On touch devices, always open if closed (don't toggle closed on first tap)
    if (isTouchDevice.value) {
      if (openDropdown.value !== item.href) {
        openDropdownMenu(item.href)
      } else {
        toggleDropdown(item.href)
      }
    }
  } else {
    // Navigate for items without children
    await handleNavigation(item.href)
  }
}

/**
 * Check if route or any of its children is active
 */
const isActiveOrParent = (item: INavItem): boolean => {
  return (
    navigationStore.isRouteActive(item.href) ||
    (item.children ? navigationStore.isParentActive(item.href) : false)
  )
}

// ===== LIFECYCLE =====
// Detect touch device on mount
onMounted(() => {
  isTouchDevice.value = 'ontouchstart' in window || navigator.maxTouchPoints > 0
  document.addEventListener('pointerdown', handleOutsidePointer)
})

onUnmounted(() => {
  document.removeEventListener('pointerdown', handleOutsidePointer)
})

// Sync current route with store on mount and route changes
// Using immediate: true ensures route is set during component setup
watch(
  () => route.path,
  (newPath) => {
    navigationStore.setCurrentRoute(newPath)
    navigationStore.setContactLabel()
  },
  { immediate: true }
)
</script>

<template>
  <nav class="flex flex-1 justify-end" :class="{ 'is-touch-device': isTouchDevice }" aria-label="Huvudnavigering">
    <ul class="hidden sm:flex  align-end items-center gap-0 list-none m-0 p-0">
      <li
      v-for="item in menuItems" :key="item.href" class="nav-item relative flex items-stretch"
        @mouseenter="handleMouseEnter(item)" @mouseleave="handleMouseLeave" @focusout="handleNavItemFocusOut">
        <!-- Parent menu item with dropdown -->
        <button
        v-if="item.children" type="button" class="nav-link" :class="{ active: isActiveOrParent(item) }"
          :aria-expanded="openDropdown === item.href" :aria-haspopup="true" @click="handleNavClick($event, item)"
          @keydown="handleDropdownKeydown($event, item); handleNavKeydown($event)" @focus="handleNavFocus(item)">
          {{ item.label }}
        </button>

        <!-- Regular nav link (no children) -->
        <NuxtLink
        v-else :to="item.href" class="nav-link" :class="{ active: isActiveOrParent(item) }"
          @click="handleNavClick($event, item)" @keydown="handleNavKeydown($event)" @focus="handleNavFocus(item)">
          {{ item.label }}
        </NuxtLink>

        <!-- Dropdown menu for children -->
        <ul
        v-if="item.children"
          :ref="(el) => { if (el) navDropdownRefs[item.href] = el as HTMLElement }"
          class="absolute top-full left-0 min-w-[250px] bg-neutral-900 list-none m-0 py-2 transition-all duration-200 ease-in-out"
          :class="openDropdown === item.href ? 'opacity-100 pointer-events-auto translate-y-0 shadow-[4px_4px_10px_rgba(0,0,0,0.25)] shadow-black/50' : 'opacity-0 pointer-events-none -translate-y-2.5 shadow-none'"
          :aria-label="`${item.label} undermeny`">
          <li v-for="(child, index) in item.children" :key="child.href" class="dropdown-item flex">
            <NuxtLink
              :to="child.href" class="dropdown-link" :class="{
                active: navigationStore.isRouteActive(child.href),
              }" 
              @click.prevent="handleNavigation(child.href)"
              @keydown="handleDropdownItemKeydown($event, item.href, index, item.children.length)"
              @focus="openDropdownMenu(item.href)">
              {{ child.label }}
            </NuxtLink>
          </li>
        </ul>

      </li>
    </ul>
    <div class="visible sm:hidden">
      <BurgerButton :open="isBurgerOpen" @toggle="isBurgerOpen = !isBurgerOpen" />

      <BurgerMenu v-model="isBurgerOpen" side="right" :menu-items="menuItems" />
    </div>
  </nav>
</template>

<style scoped>
/* Nav links and buttons - custom styles that can't be fully replaced with Tailwind */
.nav-link {
  @apply flex items-center px-5 py-4 text-layout-text-on-dark font-medium text-sm lg:text-base lg:px-6 lg:py-5;
  @apply no-underline whitespace-nowrap min-h-[44px] bg-transparent cursor-pointer transition-colors duration-200;
  border: none;
  border-bottom: 3px solid transparent;
}

/* Only apply hover on non-touch devices */
.nav-link:hover {
  @apply bg-neutral-700;
}

.is-touch-device .nav-link:hover {
  background-color: transparent;
}

.nav-link:focus-visible {
  @apply outline-2 outline-layout-text-on-dark -outline-offset-2;
}

.nav-link.active {
  @apply text-accent-400;
  border-bottom-color: theme('colors.accent.400');
}

/* Dropdown links */
.dropdown-link {
  @apply block w-full px-6 py-3 text-layout-text-on-dark font-medium text-sm lg:text-base;
  @apply no-underline transition-colors duration-200 min-h-[44px];
}

/* Only apply hover on non-touch devices */
.dropdown-link:hover {
  @apply bg-neutral-700;
}

.is-touch-device .dropdown-link:hover {
  background-color: transparent;
}

.dropdown-link:focus-visible {
  @apply outline-2 outline-layout-text-on-dark -outline-offset-2;
}

.dropdown-link.active {
  @apply text-accent-400;
}
</style>
