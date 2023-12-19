export interface CarouselAttributes {
  productId: string;
  imageId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AddCarouselInput {
  productId: string;
  imageId: string;
}
