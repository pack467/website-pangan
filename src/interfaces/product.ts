export interface ProductAttributes {
  name: string;
  price: number;
  desc: string;
  stock: number;
  status: "available" | "not available" | "preorder";
  imageUrl: string | null;
  imageId: string | null;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}
