export interface ProductAttributes {
  name: string;
  price: number;
  desc: string;
  stock: number;
  status: "available" | "not available" | "preorder";
  createdBy: string;
  readonly UUID: string;
  typeId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProductInput {
  name: string;
  price: number;
  desc: string;
  stock: number;
  typeId: string;
}

export interface PurchaseProduct {
  itemId: string;
  total: number;
}

export interface PurchaseProductValidate {
  items: PurchaseProduct[];
}

export interface ItemDetails {
  price: number;
  quantity: number;
  name: string;
  merchant_name: "WP";
}
