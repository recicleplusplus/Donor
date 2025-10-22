import { getDocs, collection } from 'firebase/firestore';
import { Product } from "../instances/products";
import { Firestore } from '../config/connection';


export async function getAllProducts(): Promise<Product[]> {
  const snapshot = await getDocs(collection(Firestore, "marketplace"));
  const arr: Product[] = [];
  snapshot.forEach((doc) => {
    const data = doc.data() as Product;
    arr.push({ ...data, intId: data.intId ?? Number(doc.id) });
  });
  return arr;
}

export function getProductsWithDiscount(products: Product[]): Product[] {
  return products.filter((p) => p.originalPrice > p.currentPrice);
}

export function getProductsWithoutDiscount(products: Product[]): Product[] {
  return products.filter((p) => p.originalPrice === p.currentPrice);
}