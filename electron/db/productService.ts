import { pool } from './database';
import { Product } from '../../src/types/pos';
import { v4 as uuidv4 } from 'uuid';

export class ProductService {
  static async getAll(): Promise<Product[]> {
    try {
      const [rows] = await pool.execute('SELECT * FROM products ORDER BY name');
      return (rows as any[]).map(row => ({
        id: row.id,
        name: row.name,
        price: parseFloat(row.price),
        categoryId: row.category_id,
        stock: row.stock,
        barcode: row.barcode,
        description: row.description,
        image: row.image,
        createdAt: new Date(row.created_at),
        updatedAt: new Date(row.updated_at),
      }));
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  }

  static async getById(id: string): Promise<Product | null> {
    try {
      const [rows] = await pool.execute('SELECT * FROM products WHERE id = ?', [id]);
      const row = (rows as any[])[0];
      if (!row) return null;
      
      return {
        id: row.id,
        name: row.name,
        price: parseFloat(row.price),
        categoryId: row.category_id,
        stock: row.stock,
        barcode: row.barcode,
        description: row.description,
        image: row.image,
        createdAt: new Date(row.created_at),
        updatedAt: new Date(row.updated_at),
      };
    } catch (error) {
      console.error('Error fetching product:', error);
      return null;
    }
  }

  static async getByCategory(categoryId: string): Promise<Product[]> {
    try {
      const [rows] = await pool.execute('SELECT * FROM products WHERE category_id = ? ORDER BY name', [categoryId]);
      return (rows as any[]).map(row => ({
        id: row.id,
        name: row.name,
        price: parseFloat(row.price),
        categoryId: row.category_id,
        stock: row.stock,
        barcode: row.barcode,
        description: row.description,
        image: row.image,
        createdAt: new Date(row.created_at),
        updatedAt: new Date(row.updated_at),
      }));
    } catch (error) {
      console.error('Error fetching products by category:', error);
      return [];
    }
  }

  static async create(productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product | null> {
    try {
      const id = uuidv4();
      await pool.execute(
        'INSERT INTO products (id, name, price, category_id, stock, barcode, description, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [
          id,
          productData.name,
          productData.price,
          productData.categoryId,
          productData.stock,
          productData.barcode || null,
          productData.description || null,
          productData.image || null
        ]
      );
      
      return await this.getById(id);
    } catch (error) {
      console.error('Error creating product:', error);
      return null;
    }
  }

  static async update(id: string, productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product | null> {
    try {
      await pool.execute(
        'UPDATE products SET name = ?, price = ?, category_id = ?, stock = ?, barcode = ?, description = ?, image = ? WHERE id = ?',
        [
          productData.name,
          productData.price,
          productData.categoryId,
          productData.stock,
          productData.barcode || null,
          productData.description || null,
          productData.image || null,
          id
        ]
      );
      
      return await this.getById(id);
    } catch (error) {
      console.error('Error updating product:', error);
      return null;
    }
  }

  static async updateStock(id: string, stock: number): Promise<boolean> {
    try {
      const [result] = await pool.execute('UPDATE products SET stock = ? WHERE id = ?', [stock, id]);
      return (result as any).affectedRows > 0;
    } catch (error) {
      console.error('Error updating product stock:', error);
      return false;
    }
  }

  static async delete(id: string): Promise<boolean> {
    try {
      const [result] = await pool.execute('DELETE FROM products WHERE id = ?', [id]);
      return (result as any).affectedRows > 0;
    } catch (error) {
      console.error('Error deleting product:', error);
      return false;
    }
  }

  static async search(searchTerm: string): Promise<Product[]> {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM products WHERE name LIKE ? OR barcode LIKE ? ORDER BY name',
        [`%${searchTerm}%`, `%${searchTerm}%`]
      );
      return (rows as any[]).map(row => ({
        id: row.id,
        name: row.name,
        price: parseFloat(row.price),
        categoryId: row.category_id,
        stock: row.stock,
        barcode: row.barcode,
        description: row.description,
        image: row.image,
        createdAt: new Date(row.created_at),
        updatedAt: new Date(row.updated_at),
      }));
    } catch (error) {
      console.error('Error searching products:', error);
      return [];
    }
  }
}