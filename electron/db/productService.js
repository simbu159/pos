const { pool } = require('./database');
const { v4: uuidv4 } = require('uuid');

class ProductService {
  static async getAll() {
    try {
      const [rows] = await pool.execute('SELECT * FROM products ORDER BY name');
      return rows.map(row => ({
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

  static async getById(id) {
    try {
      const [rows] = await pool.execute('SELECT * FROM products WHERE id = ?', [id]);
      const row = rows[0];
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

  static async getByCategory(categoryId) {
    try {
      const [rows] = await pool.execute('SELECT * FROM products WHERE category_id = ? ORDER BY name', [categoryId]);
      return rows.map(row => ({
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

  static async create(productData) {
    try {
      const id = uuidv4();
      console.log('Creating product:', { id, ...productData });
      
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
      
      console.log('Product created successfully');
      return await this.getById(id);
    } catch (error) {
      console.error('Error creating product:', error);
      return null;
    }
  }

  static async update(id, productData) {
    try {
      console.log('Updating product:', id, productData);
      
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
      
      console.log('Product updated successfully');
      return await this.getById(id);
    } catch (error) {
      console.error('Error updating product:', error);
      return null;
    }
  }

  static async updateStock(id, stock) {
    try {
      const [result] = await pool.execute('UPDATE products SET stock = ? WHERE id = ?', [stock, id]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error updating product stock:', error);
      return false;
    }
  }

  static async delete(id) {
    try {
      console.log('Deleting product:', id);
      
      const [result] = await pool.execute('DELETE FROM products WHERE id = ?', [id]);
      console.log('Product deleted successfully');
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error deleting product:', error);
      return false;
    }
  }

  static async search(searchTerm) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM products WHERE name LIKE ? OR barcode LIKE ? ORDER BY name',
        [`%${searchTerm}%`, `%${searchTerm}%`]
      );
      return rows.map(row => ({
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

module.exports = { ProductService };