import { defineStore } from 'pinia'
import type { INavItem } from '~/types/NavigationStore'

/**
 * Navigation Store State Interface
 */
interface NavigationState {
  menuItems: INavItem[]
  mobileMenuOpen: boolean
  currentRoute: string
}

/**
 * Navigation Store
 *
 * @description Manages application navigation state including menu items,
 * mobile menu toggle, and current active route tracking
 *
 * @example
 * const navigationStore = useNavigationStore()
 * const { mobileMenuOpen, menuItems } = storeToRefs(navigationStore)
 * navigationStore.toggleMobileMenu()
 */
export const useNavigationStore = defineStore('navigation', {
  // ===== STATE =====
  state: (): NavigationState => ({
    menuItems: [
      { label: 'HEM', href: '/' },
      {
        label: 'VÅRA TJÄNSTER',
        href: '/services',
        children: [
          { label: 'TRYCKSAKER', href: '/services/printed-matter' },
          {
            label: 'SCREENTRYCK & BRODYR',
            href: '/services/screen-printing-embroidery',
          },
          { label: 'DEKOR & FOLIERING', href: '/services/decoration-foiling' },
          {
            label: 'GRAFISK PRODUKTION',
            href: '/services/graphic-production',
          },
          { label: 'EVENT & MÄSSOR', href: '/services/event-advertisement' },
        ],
      },
      // { label: 'DESIGNA SJÄLV', href: '/custom-design' },
      { label: 'OM OSS', href: '/about' },
      { label: 'KONTAKT', href: '/contact' },
    ],
    mobileMenuOpen: false,
    currentRoute: '/',
  }),

  // ===== GETTERS =====
  getters: {
    /**
     * Check if mobile menu is currently open
     */
    isMenuOpen: (state): boolean => {
      return state.mobileMenuOpen
    },

    /**
     * Get the currently active menu item based on current route
     * Searches all menu items including nested children
     */
    activeMenuItem(): INavItem | undefined {
      return this.flatMenuItems.find(item => item.href === this.currentRoute)
    },

    /**
     * Check if a specific route is currently active
     */
    isRouteActive: state => {
      return (href: string): boolean => {
        return state.currentRoute === href
      }
    },

    /**
     * Get all menu items with children (parent items)
     */
    menuItemsWithChildren: (state): INavItem[] => {
      return state.menuItems.filter(item => item.children && item.children.length > 0)
    },

    /**
     * Check if current route matches any child route of a menu item
     */
    hasChildren: state => {
      return (parentHref: string): boolean => {
        const parent = state.menuItems.find(item => item.href === parentHref)
        if (!parent?.children) {
          return false
        } else {
          return true;
        }
      }
    },

    /**
     * Check if current route matches any child route of a menu item
     */
    isParentActive(): (parentHref: string) => boolean {
      return (parentHref: string): boolean => {
        const parent = this.menuItems.find(item => item.href === parentHref)
        if (!parent?.children) return false

        return parent.children.some(
          child => child.href === this.currentRoute
        )
      }
    },

    /**
     * Get all menu items flattened (including children)
     */
    flatMenuItems: (state): INavItem[] => {
      const flatten = (items: INavItem[]): INavItem[] => {
        return items.reduce((acc: INavItem[], item) => {
          acc.push(item)
          if (item.children) {
            acc.push(...flatten(item.children))
          }
          return acc
        }, [])
      }
      return flatten(state.menuItems)
    },
  },

  // ===== ACTIONS =====
  actions: {
    /**
     * Set menu items with computed contact label based on current route
     */
    setContactLabel(): void {
      // const lastRoutePart = this.currentRoute.split("/").filter(Boolean).pop()?.toUpperCase() ?? "/";
      const contactItem = this.menuItems.find(item => item.href === '/contact');
      const parentItem = this.menuItems.find(item => item.href === '/services');


      if(contactItem && parentItem) {
        const hasChildren = this.hasChildren('/services') ? 'TRUE' : 'FALSE';
        const isParentActive = this.isParentActive('/services') ? 'TRUE' : 'FALSE';
        contactItem.label = `${hasChildren}:${isParentActive}:${this.currentRoute}:${parentItem.children?.[0]?.href ?? 'null'} `;
        // contactItem.label = parentItem.children?.[0]?.href ?? 'null'
        // contactItem.label = this.currentRoute;
      }
    },

    /**
     * Toggle mobile menu open/closed state
     * Manages body scroll lock to prevent background scrolling
     */
    toggleMobileMenu(): void {
      this.mobileMenuOpen = !this.mobileMenuOpen

      // Manage body scroll lock
      if (this.mobileMenuOpen) {
        document.body.style.overflow = 'hidden'
      } else {
        document.body.style.overflow = ''
      }
    },

    /**
     * Explicitly open mobile menu
     * Prevents body scroll when menu is open
     */
    openMobileMenu(): void {
      this.mobileMenuOpen = true
      document.body.style.overflow = 'hidden'
    },

    /**
     * Explicitly close mobile menu
     * Restores body scroll capability
     */
    closeMobileMenu(): void {
      this.mobileMenuOpen = false
      document.body.style.overflow = ''
    },

    /**
     * Set the current route and auto-close mobile menu on navigation
     *
     * @param route - The route path to set as active
     */
    setCurrentRoute(route: string): void {
      this.currentRoute = route

      // Auto-close mobile menu on navigation to prevent confusion
      if (this.mobileMenuOpen) {
        this.closeMobileMenu()
      }
    },

    /**
     * Add a new menu item dynamically
     *
     * @param item - The menu item to add
     */
    addMenuItem(item: INavItem): void {
      // Prevent duplicates based on href (checks all nesting levels)
      const exists = this.flatMenuItems.some(
        existingItem => existingItem.href === item.href
      )

      if (!exists) {
        this.menuItems.push(item)
      }
    },

    /**
     * Remove a menu item by its href (works at any nesting level)
     *
     * @param href - The href of the menu item to remove
     */
    removeMenuItem(href: string): void {
      // Recursive function to remove item from any level
      const removeRecursive = (items: INavItem[]): boolean => {
        const index = items.findIndex(item => item.href === href)

        if (index !== -1) {
          items.splice(index, 1)
          return true
        }

        // Search in children
        for (const item of items) {
          if (item.children && removeRecursive(item.children)) {
            return true
          }
        }

        return false
      }

      removeRecursive(this.menuItems)
    },

    /**
     * Update menu items array
     *
     * @param items - New array of menu items
     */
    setMenuItems(items: INavItem[]): void {
      this.menuItems = items
    },
  },
})
