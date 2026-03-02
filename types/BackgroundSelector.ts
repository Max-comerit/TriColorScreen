export interface Side {
  label: string
  src: string
}

export interface Product {
  label: string
  sides: Side[]
}

export interface ProductCategory {
  label: string
  products: Product[]
}

export interface ProductCategories {
  productCategories: ProductCategory[]
}