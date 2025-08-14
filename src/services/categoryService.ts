import { pool } from '../config/database';
import { Category } from '../types/pos';
import { v4 as uuidv4 } from 'uuid';

export class CategoryService {
  static async getAll(): Promise<Category[]> {
    try {
      const [rows] = await pool.execute('SELECT * FROM categories ORDER BY name');
      return (rows as any[]).map(row => ({
        id: row.id,
        name: row.name,
        description: row.description,
        createdAt: new Date(row.created_at),
        updatedAt: new Date(row.updated_at),
      }));
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  }

  static async getById(id: string): Promise<Category | null> {
    try {
      const [rows] = await pool.execute('SELECT * FROM categories WHERE id = ?', [id]);
      const row = (rows as any[])[0];
      if (!row) return null;
      
      return {
        id: row.id,
        name: row.name,
        description: row.description,
        createdAt: new Date(row.created_at),
        updatedAt: new Date(row.updated_at),
      };
    } catch (error) {
      console.error('Error fetching category:', error);
      return null;
    }
  }

  static async create(categoryData: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>): Promise<Category | null> {
    try {
      const id = uuidv4();
      await pool.execute(
        'INSERT INTO categories (id, name, description) VALUES (?, ?, ?)',
        [id, categoryData.name, categoryData.description || null]
      );
      
      return await this.getById(id);
    } catch (error) {
      console.error('Error creating category:', error);
      return null;
    }
  }

  static async update(id: string, categoryData: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>): Promise<Category | null> {
    try {
      await pool.execute(
        'UPDATE categories SET name = ?, description = ? WHERE id = ?',
        [categoryData.name, categoryData.description || null, id]
      );
      
      return await this.getById(id);
    } catch (error) {
      console.error('Error updating category:', error);
      return null;
    }
  }

  static async delete(id: string): Promise<boolean> {
    try {
      const [result] = await pool.execute('DELETE FROM categories WHERE id = ?', [id]);
      return (result as any).affectedRows > 0;
    } catch (error) {
      console.error('Error deleting category:', error);
      return false;
    }
  }
}