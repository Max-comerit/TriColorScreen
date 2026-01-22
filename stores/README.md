# Navigation Store Documentation

## Overview

The `navigationStore` manages all navigation-related state for the TriColorScreen application, including menu items, mobile menu toggle, and route tracking.

## Features

✅ **Full TypeScript Support** - All state, getters, and actions are fully typed  
✅ **Mobile Menu Management** - Toggle with body scroll lock  
✅ **Active Route Tracking** - Automatic menu highlighting  
✅ **Nested Menu Support** - Dropdown/submenu functionality  
✅ **Dynamic Menu Items** - Add/remove items programmatically  
✅ **Auto-close on Navigation** - Improves UX on mobile devices  

---

## Installation

The store is automatically available in all components (no installation needed).

---

## State Structure

```typescript
interface NavigationState {
  menuItems: INavItem[]      // Array of navigation menu items
  mobileMenuOpen: boolean    // Mobile menu open/closed state
  currentRoute: string       // Current active route path
}

interface INavItem {
  label: string              // Display text
  href: string              // Link destination
  icon?: string            // Optional icon name/path
  children?: INavItem[]     // Nested menu items
}
```

---

## Getters

### `isMenuOpen: boolean`
Returns whether the mobile menu is currently open.

```typescript
const { isMenuOpen } = storeToRefs(navigationStore)
```

### `activeMenuItem: INavItem | undefined`
Returns the currently active menu item based on the current route.

```typescript
const { activeMenuItem } = storeToRefs(navigationStore)
```

### `isRouteActive(href: string): boolean`
Check if a specific route is active.

```typescript
const isActive = navigationStore.isRouteActive('/about')
```

### `menuItemsWithChildren: INavItem[]`
Returns all parent items that have children.

```typescript
const { menuItemsWithChildren } = storeToRefs(navigationStore)
```

### `isParentActive(parentHref: string): boolean`
Check if any child of a parent menu item is currently active.

```typescript
const isServicesActive = navigationStore.isParentActive('/services')
```

### `flatMenuItems: INavItem[]`
Returns all menu items flattened (including all nested children).

```typescript
const { flatMenuItems } = storeToRefs(navigationStore)
// Useful for sitemaps or searching all routes
```

---

## Actions

### `toggleMobileMenu(): void`
Toggle mobile menu open/closed with body scroll lock.

```typescript
navigationStore.toggleMobileMenu()
```

**Side Effects:**
- Sets `document.body.style.overflow = 'hidden'` when open
- Restores scroll when closed

### `openMobileMenu(): void`
Explicitly open the mobile menu.

```typescript
navigationStore.openMobileMenu()
```

### `closeMobileMenu(): void`
Explicitly close the mobile menu.

```typescript
navigationStore.closeMobileMenu()
```

### `setCurrentRoute(route: string): void`
Set the current active route and auto-close mobile menu.

```typescript
navigationStore.setCurrentRoute('/about')
```

**Side Effects:**
- Automatically closes mobile menu if open

### `addMenuItem(item: INavItem): void`
Add a new menu item dynamically (prevents duplicates at any nesting level).

```typescript
navigationStore.addMenuItem({
  label: 'New Page',
  href: '/new-page'
})

// Add item with children
navigationStore.addMenuItem({
  label: 'Products',
  href: '/products',
  children: [
    { label: 'Category 1', href: '/products/cat1' }
  ]
})
```

### `removeMenuItem(href: string): void`
Remove a menu item by its href (works at any nesting level).

```typescript
// Remove top-level item
navigationStore.removeMenuItem('/about')

// Remove nested child item
navigationStore.removeMenuItem('/services/printed-matter')
```

### `setMenuItems(items: INavItem[]): void`
Replace all menu items.

```typescript
navigationStore.setMenuItems([
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' }
])
```

---

## Usage Examples

### Basic Usage in Header Component

```vue
<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useNavigationStore } from '~/stores/navigationStore'

const navigationStore = useNavigationStore()
const { mobileMenuOpen, menuItems } = storeToRefs(navigationStore)

const handleMenuToggle = (): void => {
  navigationStore.toggleMobileMenu()
}
</script>

<template>
  <header>
    <button
      :aria-expanded="mobileMenuOpen"
      @click="handleMenuToggle"
    >
      Menu
    </button>

    <nav v-if="mobileMenuOpen">
      <a
        v-for="item in menuItems"
        :key="item.href"
        :href="item.href"
      >
        {{ item.label }}
      </a>
    </nav>
  </header>
</template>
```

### Auto-sync with Vue Router

```vue
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
```

### Keyboard & Outside Click Handling

```vue
<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useNavigationStore } from '~/stores/navigationStore'

const navigationStore = useNavigationStore()
const { mobileMenuOpen } = storeToRefs(navigationStore)

const handleEscape = (event: KeyboardEvent): void => {
  if (event.key === 'Escape' && mobileMenuOpen.value) {
    navigationStore.closeMobileMenu()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleEscape)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscape)
})
</script>
```

---

## TypeScript Support

Import types from the store:

```typescript
import type { INavItem } from '~/stores/navigationStore'
// or
import type { INavItem } from '~/types'
```

---

## Best Practices

1. **Always use `storeToRefs`** for reactive state/getters
2. **Actions can be destructured** directly from the store
3. **Set current route** on navigation to keep state in sync
4. **Handle body scroll lock** is automatic when using toggle/open/close actions
5. **Prevent duplicates** when adding menu items (handled automatically)

---

## Accessibility Considerations

The store is designed with accessibility in mind:

- Body scroll lock prevents background scrolling when menu is open
- Auto-close on navigation prevents confusion
- Works with keyboard navigation (Escape key)
- Compatible with screen readers when used with proper ARIA attributes

---

## Testing

Example test structure:

```typescript
import { setActivePinia, createPinia } from 'pinia'
import { useNavigationStore } from '~/stores/navigationStore'

describe('navigationStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should toggle mobile menu', () => {
    const store = useNavigationStore()
    expect(store.mobileMenuOpen).toBe(false)

    store.toggleMobileMenu()
    expect(store.mobileMenuOpen).toBe(true)

    store.toggleMobileMenu()
    expect(store.mobileMenuOpen).toBe(false)
  })

  it('should set current route and close menu', () => {
    const store = useNavigationStore()
    store.openMobileMenu()
    expect(store.mobileMenuOpen).toBe(true)

    store.setCurrentRoute('/about')
    expect(store.currentRoute).toBe('/about')
    expect(store.mobileMenuOpen).toBe(false)
  })
})
```

---

## Related Files

- `stores/navigationStore.ts` - Main store implementation
- `stores/navigationStore.examples.ts` - Detailed usage examples
- `types/NavigationStore.ts` - INavItem interface definition
- `types/Index.ts` - Type exports
- `components/layout/Header.vue` - Primary consumer

---

**Version**: 1.0.0  
**Last Updated**: January 21, 2026
