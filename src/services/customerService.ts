import { pool } from '../config/database';
import { Customer } from '../types/pos';
import { v4 as uuidv4 } from 'uuid';

export class CustomerService {
  static async getAll(): Promise<Customer[]> {
    try {
      const [rows] = await pool.execute('SELECT * FROM customers ORDER BY name');
      return (rows as any[]).map(row => ({
        id: row.id,
        name: row.name,
        email: row.email,
        phone: row.phone,
        address: row.address,
        createdAt: new Date(row.created_at),
        updatedAt: new Date(row.updated_at),
      }));
    } catch (error) {
      console.error('Error fetching customers:', error);
      return [];
    }
  }

  static async getById(id: string): Promise<Customer | null> {
    try {
      const [rows] = await pool.execute('SELECT * FROM customers WHERE id = ?', [id]);
      const row = (rows as any[])[0];
      if (!row) return null;
      
      return {
        id: row.id,
        name: row.name,
        email: row.email,
        phone: row.phone,
        address: row.address,
        createdAt: new Date(row.created_at),
        updatedAt: new Date(row.updated_at),
      };
    } catch (error) {
      console.error('Error fetching customer:', error);
      return null;
    }
  }

  static async create(customerData: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>): Promise<Customer | null> {
    try {
      const id = uuidv4();
      await pool.execute(
        'INSERT INTO customers (id, name, email, phone, address) VALUES (?, ?, ?, ?, ?)',
        [
          id,
          customerData.name,
          customerData.email || null,
          customerData.phone || null,
          customerData.address || null
        ]
      );
      
      return await this.getById(id);
    } catch (error) {
      console.error('Error creating customer:', error);
      return null;
    }
  }

  static async update(id: string, customerData: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>): Promise<Customer | null> {
    try {
      await pool.execute(
        'UPDATE customers SET name = ?, email = ?, phone = ?, address = ? WHERE id = ?',
        [
          customerData.name,
          customerData.email || null,
          customerData.phone || null,
          customerData.address || null,
          id
        ]
      );
      
      return await this.getById(id);
    } catch (error) {
      console.error('Error updating customer:', error);
      return null;
    }
  }

  static async delete(id: string): Promise<boolean> {
    try {
      const [result] = await pool.execute('DELETE FROM customers WHERE id = ?', [id]);
      return (result as any).affectedRows > 0;
    } catch (error) {
      console.error('Error deleting customer:', error);
      return false;
    }
  }

  static async search(searchTerm: string): Promise<Customer[]> {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM customers WHERE name LIKE ? OR email LIKE ? OR phone LIKE ? ORDER BY name',
        [`%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`]
      );
      return (rows as any[]).map(row => ({
        id: row.id,
        name: row.name,
        email: row.email,
        phone: row.phone,
        address: row.address,
        createdAt: new Date(row.created_at),
        updatedAt: new Date(row.updated_at),
      }));
    } catch (error) {
      console.error('Error searching customers:', error);
      return [];
    }
  }
}