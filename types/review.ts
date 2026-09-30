export interface Review {
  id: string;
  productId: string;
  author: string;
  rating: number;
  title?: string;
  comment: string;
  createdAt: string;
}
