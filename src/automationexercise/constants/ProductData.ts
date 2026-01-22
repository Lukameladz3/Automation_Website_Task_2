export const ProductData = {
  products: [
    { name: 'Blue Top', price: 500 },
    { name: 'Men Tshirt', price: 400 },
    { name: 'Sleeveless Dress', price: 1000 }
  ]
} as const;

export const PRODUCT_NAMES = ProductData.products.map(p => p.name);
export const PRODUCT_PRICES = ProductData.products.map(p => p.price);