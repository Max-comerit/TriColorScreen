export interface Side {
  label: string
  src: string
}

export interface Product {
  label: string
  activeSide: number
  sides: Side[]
}

export interface ProductCategory {
  label: string
  activeProduct: number
  products: Product[]
}

export interface ProductCategories {
  activeProductCategory: number
  productCategories: ProductCategory[]
}