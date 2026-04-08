/**
 * Navigation Store Usage Example
 *
 * This file demonstrates how to use the navigationStore in components
 */

// ===== EXAMPLE 1: Basic Usage in Header Component =====

/*
<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useNavigationStore } from '~/stores/navigationStore'

// Get store instance
const navigationStore = useNavigationStore()

// Use storeToRefs for reactive state/getters
const { mobileMenuOpen, menuItems, activeMenuItem } = storeToRefs(navigationStore)

// Actions can be destructured directly or called on store
const { toggleMobileMenu, setCurrentRoute } = navigationStore

// Handle menu toggle
const handleMenuToggle = (): void => {
  toggleMobileMenu()
}

// Handle navigation
const handleNavigation = (href: string): void => {
  setCurrentRoute(href)
  navigateTo(href)
}
</script>

<template>
  <header class="sticky top-0 z-50 bg-white shadow-md">
    <nav aria-label="Main navigation">
      <!-- Hamburger button -->
      <button
        type="button"
        :aria-expanded="mobileMenuOpen"
        aria-controls="mobile-menu"
        aria-label="Toggle mobile menu"
        @click="handleMenuToggle"
      >
        Menu
      </button>

      <!-- Desktop Navigation -->
      <ul class="hidden lg:flex gap-6">
        <li v-for="item in menuItems" :key="item.href" class="relative group">
          <a
            :href="item.href"
            :class="{ 
              active: navigationStore.isRouteActive(item.href) || 
                     (item.children && navigationStore.isParentActive(item.href))
            }"
            @click.prevent="handleNavigation(item.href)"
          >
            {{ item.label }}
          </a>

          <!-- Dropdown for nested children -->
          <ul 
            v-if="item.children" 
            class="absolute hidden group-hover:block bg-white shadow-lg rounded p-2"
          >
            <li v-for="child in item.children" :key="child.href">
              <a
                :href="child.href"
                class="block px-4 py-2 hover:bg-gray-100"
                :class="{ active: navigationStore.isRouteActive(child.href) }"
                @click.prevent="handleNavigation(child.href)"
              >
                {{ child.label }}
              </a>
            </li>
          </ul>
        </li>
      </ul>
    </nav>
  </header>
</template>
*/

// ===== EXAMPLE 2: Nested Menu with Dropdown =====

/*
<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useNavigationStore } from '~/stores/navigationStore'

const navigationStore = useNavigationStore()
const { menuItems } = storeToRefs(navigationStore)

// Check if parent (VÅRA TJÄNSTER) should be highlighted
const isServicesActive = computed(() => navigationStore.isParentActive('/services/printed-matter'))
</script>

<template>
  <nav>
    <ul class="flex gap-6">
      <li v-for="item in menuItems" :key="item.href" class="relative group">
        <NuxtLink 
          :to="item.href"
          :class="{ 
            'text-primary': navigationStore.isRouteActive(item.href) || 
                           (item.children && navigationStore.isParentActive(item.href))
          }"
        >
          {{ item.label }}
        </NuxtLink>

        <!-- Dropdown for items with children -->
        <ul 
          v-if="item.children" 
          class="absolute hidden group-hover:block bg-white shadow-lg rounded-card p-2 min-w-[200px]"
        >
          <li v-for="child in item.children" :key="child.href">
            <NuxtLink 
              :to="child.href"
              class="block px-4 py-2 hover:bg-gray-100 rounded"
              :class="{ 'text-primary font-semibold': navigationStore.isRouteActive(child.href) }"
            >
              {{ child.label }}
            </NuxtLink>
          </li>
        </ul>
      </li>
    </ul>
  </nav>
</template>
*/

// ===== EXAMPLE 3: Mobile Menu with Nested Items =====

/*
<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useNavigationStore } from '~/stores/navigationStore'

const navigationStore = useNavigationStore()
const { mobileMenuOpen, menuItems } = storeToRefs(navigationStore)

// Track which parent menus are expanded
const expandedMenus = ref<Set<string>>(new Set())

const toggleSubmenu = (href: string): void => {
  if (expandedMenus.value.has(href)) {
    expandedMenus.value.delete(href)
  } else {
    expandedMenus.value.add(href)
  }
}
</script>

<template>
  <div
    v-if="mobileMenuOpen"
    class="fixed inset-0 bg-white z-50 overflow-y-auto"
  >
    <nav class="p-4">
      <ul class="space-y-2">
        <li v-for="item in menuItems" :key="item.href">
          <!-- Parent link -->
          <div class="flex items-center justify-between">
            <NuxtLink 
              :to="item.href"
              class="flex-1 px-4 py-3 text-lg"
              :class="{ 'text-primary font-bold': navigationStore.isRouteActive(item.href) }"
            >
              {{ item.label }}
            </NuxtLink>
            
            <!-- Expand button if has children -->
            <button
              v-if="item.children"
              @click="toggleSubmenu(item.href)"
              class="p-3"
              :aria-expanded="expandedMenus.has(item.href)"
            >
              {{ expandedMenus.has(item.href) ? '−' : '+' }}
            </button>
          </div>

          <!-- Child links -->
          <ul 
            v-if="item.children && expandedMenus.has(item.href)"
            class="ml-4 mt-2 space-y-1 border-l-2 border-gray-200"
          >
            <li v-for="child in item.children" :key="child.href">
              <NuxtLink
                :to="child.href"
                class="block px-4 py-2 text-base"
                :class="{ 'text-primary font-semibold': navigationStore.isRouteActive(child.href) }"
              >
                {{ child.label }}
              </NuxtLink>
            </li>
          </ul>
        </li>
      </ul>
    </nav>
  </div>
</template>
*/

// ===== EXAMPLE 4: Using Nested Menu Getters =====

/*
<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useNavigationStore } from '~/stores/navigationStore'

const navigationStore = useNavigationStore()
const { menuItemsWithChildren, flatMenuItems } = storeToRefs(navigationStore)

// Get all parent menu items
console.log('Parent menus:', menuItemsWithChildren.value)
// Output: [{ label: 'VÅRA TJÄNSTER', href: '/services/printed-matter', children: [...] }]

// Get all menu items flattened (useful for sitemap)
console.log('All routes:', flatMenuItems.value.map(item => item.href))
// Output: ['/', '/services/printed-matter', '/services/screen-printing-embroidery', ...]

// Check if specific route is active
const isHomeActive = computed(() => navigationStore.isRouteActive('/'))
const isServicesParentActive = computed(() => navigationStore.isParentActive('/services/printed-matter'))
</script>
*/

// ===== EXAMPLE 5: Managing Nested Menu Items Dynamically =====

/*
<script setup lang="ts">
import { useNavigationStore } from '~/stores/navigationStore'
import type { INavItem } from '~/types/NavigationStore'

const navigationStore = useNavigationStore()

// Add a top-level menu item with children
const addProductsMenu = (): void => {
  const newItem: INavItem = {
    label: 'PRODUKTER',
    href: '/products/textiles',
    children: [
      { label: 'TEXTILIER', href: '/products/textiles' },
      { label: 'SKYLTAR', href: '/products/signs' },
    ]
  }
  navigationStore.addMenuItem(newItem)
}

// Add a simple menu item
const addNewPage = (): void => {
  const newItem: INavItem = {
    label: 'NY SIDA',
    href: '/new-page',
  }
  navigationStore.addMenuItem(newItem)
}

// Remove a top-level item
const removeAboutPage = (): void => {
  navigationStore.removeMenuItem('/about')
}

// Remove a nested child item (works at any level!)
const removePrintedMatter = (): void => {
  navigationStore.removeMenuItem('/services/printed-matter')
}

// Replace all menu items
const updateMenu = (): void => {
  const newMenu: INavItem[] = [
    { label: 'HEM', href: '/' },
    { 
      label: 'VÅRA TJÄNSTER', 
      href: '/services/printed-matter',
      children: [
        { label: 'TRYCKSAKER', href: '/services/printed-matter' },
        { label: 'SCREENTRYCK & BRODYR', href: '/services/screen-printing-embroidery' }
      ]
    },
  ]
  navigationStore.setMenuItems(newMenu)
}
</script>
*/

// ===== EXAMPLE 6: Handling Outside Click and Escape Key =====

/*
<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useNavigationStore } from '~/stores/navigationStore'

const navigationStore = useNavigationStore()
const { mobileMenuOpen } = storeToRefs(navigationStore)

// Close menu on escape key
const handleEscape = (event: KeyboardEvent): void => {
  if (event.key === 'Escape' && mobileMenuOpen.value) {
    navigationStore.closeMobileMenu()
  }
}

// Close menu on outside click
const handleOutsideClick = (event: MouseEvent): void => {
  const menu = document.getElementById('mobile-menu')
  const button = document.getElementById('menu-toggle')

  if (
    mobileMenuOpen.value &&
    menu &&
    !menu.contains(event.target as Node) &&
    button &&
    !button.contains(event.target as Node)
  ) {
    navigationStore.closeMobileMenu()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleEscape)
  document.addEventListener('click', handleOutsideClick)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscape)
  document.removeEventListener('click', handleOutsideClick)
})
</script>
*/

// ===== EXAMPLE 7: Watch Route Changes =====

/*
<script setup lang="ts">
import { useNavigationStore } from '~/stores/navigationStore'

const navigationStore = useNavigationStore()
const route = useRoute()

// Update store when route changes
watch(
  () => route.path,
  (newPath) => {
    navigationStore.setCurrentRoute(newPath)
  },
  { immediate: true }
)
</script>
*/

// ===== EXAMPLE 8: Breadcrumb Navigation with Nested Menu =====

/*
<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useNavigationStore } from '~/stores/navigationStore'

const navigationStore = useNavigationStore()
const { flatMenuItems } = storeToRefs(navigationStore)
const route = useRoute()

// Build breadcrumb from current route
const breadcrumbs = computed(() => {
  const currentItem = flatMenuItems.value.find(item => item.href === route.path)
  if (!currentItem) return []

  const crumbs: INavItem[] = []
  
  // Add home
  crumbs.push({ label: 'HEM', href: '/' })
  
  // If it's a nested route, find parent
  if (currentItem.href.includes('/services/')) {
    crumbs.push({ label: 'VÅRA TJÄNSTER', href: '/services/printed-matter' })
  }
  
  // Add current page
  if (currentItem.href !== '/') {
    crumbs.push(currentItem)
  }
  
  return crumbs
})
</script>

<template>
  <nav aria-label="Breadcrumb">
    <ol class="flex gap-2 text-sm">
      <li v-for="(crumb, index) in breadcrumbs" :key="crumb.href" class="flex items-center gap-2">
        <NuxtLink 
          v-if="index < breadcrumbs.length - 1"
          :to="crumb.href"
          class="text-gray-600 hover:text-primary"
        >
          {{ crumb.label }}
        </NuxtLink>
        <span v-else class="text-gray-900 font-semibold">
          {{ crumb.label }}
        </span>
        <span v-if="index < breadcrumbs.length - 1" class="text-gray-400">/</span>
      </li>
    </ol>
  </nav>
</template>
*/

export {}
