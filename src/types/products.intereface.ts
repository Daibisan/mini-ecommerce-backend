export interface ProductRequest {
    name: string;
    description?: string;
    price: number;
    stock: number;
    category_id: string;
}