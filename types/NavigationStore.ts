/**
 * Navigation Menu Item Interface
 */
export interface INavItem {
  label: string
  href: string
  icon?: string
  children?: INavItem[]
}
