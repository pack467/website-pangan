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
