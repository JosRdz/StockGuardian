export interface Product {
  id: string;
  name: string;
  quantity: number;
  expirationDate: string;
  supplier?: string;
  costPrice?: number;
  salePrice: number;
  status: 'good' | 'warning' | 'critical';
  category: string;
}

export interface SaleItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface Sale {
  id: string;
  date: string;
  items: SaleItem[];
  total: number;
}

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Leche Entera',
    quantity: 45,
    expirationDate: '2026-03-30',
    supplier: 'Lácteos del Valle',
    costPrice: 18,
    salePrice: 25,
    status: 'warning',
    category: 'Lácteos',
  },
  {
    id: '2',
    name: 'Pan Integral',
    quantity: 30,
    expirationDate: '2026-03-26',
    supplier: 'Panadería Artesanal',
    costPrice: 12,
    salePrice: 20,
    status: 'critical',
    category: 'Panadería',
  },
  {
    id: '3',
    name: 'Manzanas Rojas',
    quantity: 120,
    expirationDate: '2026-04-15',
    supplier: 'Frutas Frescas SA',
    costPrice: 8,
    salePrice: 15,
    status: 'good',
    category: 'Frutas',
  },
  {
    id: '4',
    name: 'Yogur Natural',
    quantity: 8,
    expirationDate: '2026-03-28',
    supplier: 'Lácteos del Valle',
    costPrice: 15,
    salePrice: 22,
    status: 'critical',
    category: 'Lácteos',
  },
  {
    id: '5',
    name: 'Arroz Blanco 1kg',
    quantity: 150,
    expirationDate: '2027-01-15',
    supplier: 'Distribuidora Global',
    costPrice: 20,
    salePrice: 28,
    status: 'good',
    category: 'Granos',
  },
  {
    id: '6',
    name: 'Tomates Frescos',
    quantity: 5,
    expirationDate: '2026-03-27',
    supplier: 'Frutas Frescas SA',
    costPrice: 10,
    salePrice: 18,
    status: 'critical',
    category: 'Verduras',
  },
  {
    id: '7',
    name: 'Aceite de Oliva',
    quantity: 25,
    expirationDate: '2026-12-30',
    supplier: 'Aceites Premium',
    costPrice: 45,
    salePrice: 65,
    status: 'good',
    category: 'Aceites',
  },
  {
    id: '8',
    name: 'Queso Manchego',
    quantity: 12,
    expirationDate: '2026-04-05',
    supplier: 'Lácteos del Valle',
    costPrice: 55,
    salePrice: 80,
    status: 'warning',
    category: 'Lácteos',
  },
  {
    id: '9',
    name: 'Pasta Fusilli',
    quantity: 80,
    expirationDate: '2026-11-20',
    supplier: 'Distribuidora Global',
    costPrice: 15,
    salePrice: 22,
    status: 'good',
    category: 'Pasta',
  },
  {
    id: '10',
    name: 'Huevos (Docena)',
    quantity: 18,
    expirationDate: '2026-03-29',
    supplier: 'Granja Los Robles',
    costPrice: 32,
    salePrice: 45,
    status: 'warning',
    category: 'Lácteos',
  },
  {
    id: '11',
    name: 'Zanahorias',
    quantity: 35,
    expirationDate: '2026-04-08',
    supplier: 'Frutas Frescas SA',
    costPrice: 6,
    salePrice: 12,
    status: 'good',
    category: 'Verduras',
  },
  {
    id: '12',
    name: 'Pollo Fresco',
    quantity: 3,
    expirationDate: '2026-03-25',
    supplier: 'Carnes Premium',
    costPrice: 85,
    salePrice: 120,
    status: 'critical',
    category: 'Carnes',
  },
];

export const mockSales: Sale[] = [
  {
    id: 'V001',
    date: '2026-03-24T10:30:00',
    items: [
      { productId: '1', productName: 'Leche Entera', quantity: 2, price: 25, subtotal: 50 },
      { productId: '3', productName: 'Manzanas Rojas', quantity: 3, price: 15, subtotal: 45 },
      { productId: '5', productName: 'Arroz Blanco 1kg', quantity: 1, price: 28, subtotal: 28 },
    ],
    total: 123,
  },
  {
    id: 'V002',
    date: '2026-03-24T11:15:00',
    items: [
      { productId: '7', productName: 'Aceite de Oliva', quantity: 1, price: 65, subtotal: 65 },
      { productId: '9', productName: 'Pasta Fusilli', quantity: 2, price: 22, subtotal: 44 },
    ],
    total: 109,
  },
  {
    id: 'V003',
    date: '2026-03-24T14:20:00',
    items: [
      { productId: '2', productName: 'Pan Integral', quantity: 4, price: 20, subtotal: 80 },
      { productId: '4', productName: 'Yogur Natural', quantity: 3, price: 22, subtotal: 66 },
      { productId: '10', productName: 'Huevos (Docena)', quantity: 2, price: 45, subtotal: 90 },
    ],
    total: 236,
  },
  {
    id: 'V004',
    date: '2026-03-23T09:45:00',
    items: [
      { productId: '8', productName: 'Queso Manchego', quantity: 1, price: 80, subtotal: 80 },
      { productId: '11', productName: 'Zanahorias', quantity: 2, price: 12, subtotal: 24 },
    ],
    total: 104,
  },
  {
    id: 'V005',
    date: '2026-03-23T16:30:00',
    items: [
      { productId: '3', productName: 'Manzanas Rojas', quantity: 5, price: 15, subtotal: 75 },
      { productId: '6', productName: 'Tomates Frescos', quantity: 2, price: 18, subtotal: 36 },
      { productId: '12', productName: 'Pollo Fresco', quantity: 1, price: 120, subtotal: 120 },
    ],
    total: 231,
  },
];

export const getDaysUntilExpiration = (expirationDate: string): number => {
  const today = new Date('2026-03-24');
  const expDate = new Date(expirationDate);
  const diffTime = expDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

export const getProductStatus = (expirationDate: string): 'good' | 'warning' | 'critical' => {
  const daysUntil = getDaysUntilExpiration(expirationDate);
  if (daysUntil <= 3) return 'critical';
  if (daysUntil <= 7) return 'warning';
  return 'good';
};