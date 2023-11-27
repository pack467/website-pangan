export interface ProductAttributes {
  name: string;
  price: number;
  desc: string;
  stock: number;
  status: "available" | "not available" | "preorder";
  imageUrl: string | null;
  imageId: string | null;
  createdBy: string;
  UUID: string;
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
