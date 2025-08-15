const { pool } = require('./database');
const { v4: uuidv4 } = require('uuid');

class CategoryService {
  static async getAll() {
    try {
      const [rows] = await pool.execute('SELECT * FROM categories ORDER BY name');
      return rows.map(row => ({
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

  static async getById(id) {
    try {
      const [rows] = await pool.execute('SELECT * FROM categories WHERE id = ?', [id]);
      const row = rows[0];
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

  static async create(categoryData) {
    try {
      const id = uuidv4();
      console.log('Creating category:', { id, ...categoryData });
      
      await pool.execute(
        'INSERT INTO categories (id, name, description) VALUES (?, ?, ?)',
        [id, categoryData.name, categoryData.description || null]
      );
      
      console.log('Category created successfully');
      return await this.getById(id);
    } catch (error) {
      console.error('Error creating category:', error);
      return null;
    }
  }

  static async update(id, categoryData) {
    try {
      console.log('Updating category:', id, categoryData);
      
      await pool.execute(
        'UPDATE categories SET name = ?, description = ? WHERE id = ?',
        [categoryData.name, categoryData.description || null, id]
      );
      
      console.log('Category updated successfully');
      return await this.getById(id);
    } catch (error) {
      console.error('Error updating category:', error);
      return null;
    }
  }

  static async delete(id) {
    try {
      console.log('Deleting category:', id);
      
      const [result] = await pool.execute('DELETE FROM categories WHERE id = ?', [id]);
      console.log('Category deleted successfully');
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error deleting category:', error);
      return false;
    }
  }
}

module.exports = { CategoryService };