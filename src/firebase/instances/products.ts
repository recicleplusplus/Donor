export interface Product {
    id: number;
    name: string;
    imageUrl: any;
    price: number;
    originalPrice: number; // always present
    stock: number;
    category: string;
    description: string;
}


export const products: Product[] = [
    { id: 1, name: 'Smartphone Eco', price: 150, imageUrl: require('../../../assets/images/greenLogo.png'), originalPrice: 200, category: 'Eletrônicos', stock: 10, description: 'Smartphone recondicionado com embalagem sustentável.' },
    { id: 2, name: 'Tênis Sustentável', price: 80, imageUrl: require('../../../assets/images/greenLogo.png'), originalPrice: 120, category: 'Moda', stock: 5, description: 'Tênis feito com materiais reciclados.' },
    { id: 3, name: 'Livro Reciclado', price: 25, imageUrl: require('../../../assets/images/greenLogo.png'), originalPrice: 35, category: 'Livros', stock: 0, description: 'Papel reciclado e impressão com tinta ecológica.' },
    { id: 4, name: 'Camiseta Orgânica', price: 45, imageUrl: require('../../../assets/images/greenLogo.png'), originalPrice: 60, category: 'Moda', stock: 8, description: 'Algodão orgânico certificado.' },
    { id: 5, name: 'Garrafa Reutilizável', price: 20, imageUrl: require('../../../assets/images/greenLogo.png'), originalPrice: 20, category: 'Casa', stock: 15, description: 'Aço inox com isolamento térmico.' },
    { id: 6, name: 'Kit de Jardinagem', price: 35, imageUrl: require('../../../assets/images/greenLogo.png'), originalPrice: 35, category: 'Casa', stock: 12, description: 'Ferramentas resistentes e sustentáveis.' },
    { id: 7, name: 'Notebook Refurbished', price: 200, imageUrl: require('../../../assets/images/greenLogo.png'), originalPrice: 200, category: 'Eletrônicos', stock: 5, description: 'Notebook recondicionado com garantia.' },
    { id: 8, name: 'Bolsa Ecológica', price: 30, imageUrl: require('../../../assets/images/greenLogo.png'), originalPrice: 30, category: 'Moda', stock: 20, description: 'Produzida com fibras naturais.' },
];


export function getProductsWithDiscount(): Product[] {
    return products.filter((p) => p.originalPrice > p.price);
}

export function getProductsWithoutDiscount(): Product[] {
    return products.filter((p) => p.originalPrice === p.price);
}

export function getProductById(id: number) {
    return products.find((p) => p.id === id);
}
