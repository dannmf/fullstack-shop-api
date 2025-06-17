
export class ProductDto {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  categoryName: string;
  imageUrl: string;

  constructor(data: any) {
    this.id = data.id;
    this.name = data.name;
    this.description = data.description || '';
    this.price = data.price;
    this.stock = data.stock;
    this.categoryName = data.category?.name || 'Sem categoria';
    this.imageUrl = data.imageUrl || '';
  }
}

export class LowStockProductDto {
  id: number;
  name: string;
  stock: number;
  categoryName: string;
  imageUrl: string;

  constructor(data: any) {
    this.id = data.id;
    this.name = data.name;
    this.stock = data.stock;
    this.categoryName = data.category?.name || 'Sem categoria';
    this.imageUrl = data.imageUrl || '';
  }
}