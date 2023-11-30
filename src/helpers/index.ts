import type { PurchaseProduct } from "../interfaces/product";
import { Product } from "../models";

export const searchNotFoundDataTransaction = (
  items: PurchaseProduct[],
  products: Product[]
): string[] => {
  const notFoundData: string[] = [];
  for (const item of items)
    if (!products.map((el) => el.UUID).includes(item.itemId))
      notFoundData.push(item.itemId);
  return notFoundData;
};

export const searchOutOfStockDataTransaction = (
  items: PurchaseProduct[],
  products: Product[]
): string[] => {
  const outOfStock: string[] = [];
  for (const product of products)
    for (const item of items)
      if (item.itemId === product.UUID && product.stock < item.total)
        outOfStock.push(item.itemId);
  return outOfStock;
};

export const countTransactionValue = (
  items: PurchaseProduct[],
  products: Product[]
): number =>
  products
    .map(
      ({ price, UUID }) =>
        (items.find((el) => el.itemId === UUID) as PurchaseProduct).total *
        price
    )
    .reduce((prev, curr) => prev + curr);
