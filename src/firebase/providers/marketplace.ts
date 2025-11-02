import { getDocs, collection, doc, getDoc, updateDoc } from 'firebase/firestore';
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


export async function decrementProductStock(productId: number): Promise<boolean> {
  try {
    // Busca o documento do produto pelo intId
    const snapshot = await getDocs(collection(Firestore, 'marketplace'));
    let productDocId = null;
    let currentStock = null;
    snapshot.forEach((docu) => {
      const data = docu.data() as Product;
      if ((data.intId ?? Number(docu.id)) === productId) {
        productDocId = docu.id;
        currentStock = data.stock;
      }
    });
    if (!productDocId || currentStock === null) return false;
    if (currentStock <= 0) return false;
    const productRef = doc(Firestore, 'marketplace', productDocId);
    await updateDoc(productRef, { stock: currentStock - 1 });
    return true;
  } catch (e) {
    console.error('Erro ao decrementar estoque:', e);
    return false;
  }
}