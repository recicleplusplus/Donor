export interface Product {
    id: number;
    name: string;
    imageUrl: any;
    price: number;
    originalPrice?: number;
    stock: number;
    category: string;
}