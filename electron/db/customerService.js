const { pool } = require('./database');
const { v4: uuidv4 } = require('uuid');

class CustomerService {
  static async getAll() {
    try {
      const [rows] = await pool.execute('SELECT * FROM customers ORDER BY name');
      return rows.map(row => ({
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

  static async getById(id) {
    try {
      const [rows] = await pool.execute('SELECT * FROM customers WHERE id = ?', [id]);
      const row = rows[0];
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

  static async create(customerData) {
    try {
      const id = uuidv4();
      console.log('Creating customer:', { id, ...customerData });
      
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
      
      console.log('Customer created successfully');
      return await this.getById(id);
    } catch (error) {
      console.error('Error creating customer:', error);
      return null;
    }
  }

  static async update(id, customerData) {
    try {
      console.log('Updating customer:', id, customerData);
      
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
      
      console.log('Customer updated successfully');
      return await this.getById(id);
    } catch (error) {
      console.error('Error updating customer:', error);
      return null;
    }
  }

  static async delete(id) {
    try {
      console.log('Deleting customer:', id);
      
      const [result] = await pool.execute('DELETE FROM customers WHERE id = ?', [id]);
      console.log('Customer deleted successfully');
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error deleting customer:', error);
      return false;
    }
  }

  static async search(searchTerm) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM customers WHERE name LIKE ? OR email LIKE ? OR phone LIKE ? ORDER BY name',
        [`%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`]
      );
      return rows.map(row => ({
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

module.exports = { CustomerService };