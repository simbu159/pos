import { pool } from './database';
import { Transaction } from '../../src/types/pos';
import { v4 as uuidv4 } from 'uuid';

export class TransactionService {
  static async create(transaction: Transaction): Promise<Transaction | null> {
    const connection = await pool.getConnection();
    
    try {
      await connection.beginTransaction();
      
      // Insert transaction
      const transactionId = uuidv4();
      await connection.execute(
        'INSERT INTO transactions (id, customer_id, subtotal, tax, total, payment_method) VALUES (?, ?, ?, ?, ?, ?)',
        [
          transactionId,
          transaction.customer?.id || null,
          transaction.subtotal,
          transaction.tax,
          transaction.total,
          transaction.paymentMethod
        ]
      );
      
      // Insert transaction items
      for (const item of transaction.items) {
        const itemId = uuidv4();
        await connection.execute(
          'INSERT INTO transaction_items (id, transaction_id, product_id, product_name, product_price, quantity, subtotal) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [
            itemId,
            transactionId,
            item.product.id,
            item.product.name,
            item.product.price,
            item.quantity,
            item.subtotal
          ]
        );
        
        // Update product stock
        await connection.execute(
          'UPDATE products SET stock = stock - ? WHERE id = ?',
          [item.quantity, item.product.id]
        );
      }
      
      await connection.commit();
      
      return await this.getById(transactionId);
    } catch (error) {
      await connection.rollback();
      console.error('Error creating transaction:', error);
      return null;
    } finally {
      connection.release();
    }
  }

  static async getById(id: string): Promise<Transaction | null> {
    try {
      // Get transaction
      const [transactionRows] = await pool.execute('SELECT * FROM transactions WHERE id = ?', [id]);
      const transactionRow = (transactionRows as any[])[0];
      if (!transactionRow) return null;
      
      // Get transaction items
      const [itemRows] = await pool.execute(
        'SELECT * FROM transaction_items WHERE transaction_id = ?',
        [id]
      );
      
      const items = (itemRows as any[]).map(item => ({
        product: {
          id: item.product_id,
          name: item.product_name,
          price: parseFloat(item.product_price),
          categoryId: '',
          stock: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        quantity: item.quantity,
        subtotal: parseFloat(item.subtotal),
      }));
      
      return {
        id: transactionRow.id,
        items,
        subtotal: parseFloat(transactionRow.subtotal),
        tax: parseFloat(transactionRow.tax),
        total: parseFloat(transactionRow.total),
        paymentMethod: transactionRow.payment_method,
        timestamp: new Date(transactionRow.timestamp),
      };
    } catch (error) {
      console.error('Error fetching transaction:', error);
      return null;
    }
  }

  static async getAll(limit: number = 100): Promise<Transaction[]> {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM transactions ORDER BY timestamp DESC LIMIT ?',
        [limit]
      );
      
      const transactions = [];
      for (const row of rows as any[]) {
        const transaction = await this.getById(row.id);
        if (transaction) {
          transactions.push(transaction);
        }
      }
      
      return transactions;
    } catch (error) {
      console.error('Error fetching transactions:', error);
      return [];
    }
  }

  static async getByDateRange(startDate: Date, endDate: Date): Promise<Transaction[]> {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM transactions WHERE timestamp BETWEEN ? AND ? ORDER BY timestamp DESC',
        [startDate, endDate]
      );
      
      const transactions = [];
      for (const row of rows as any[]) {
        const transaction = await this.getById(row.id);
        if (transaction) {
          transactions.push(transaction);
        }
      }
      
      return transactions;
    } catch (error) {
      console.error('Error fetching transactions by date range:', error);
      return [];
    }
  }
}