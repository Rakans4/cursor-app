import pool from '../database/config.js';

export class TaskController {
  async getTasks(req, res) {
    const client = await pool.connect();
    try {
      const { page = 1, limit = 10, status, priority, search } = req.query;
      const pageNum = parseInt(page);
      const limitNum = parseInt(limit);
      const userId = req.user.id;
      const offset = (pageNum - 1) * limitNum;

      // Build the WHERE clause
      let whereConditions = ['user_id = $1'];
      let queryParams = [userId];
      let paramIndex = 2;

      if (status) {
        whereConditions.push(`status = $${paramIndex}`);
        queryParams.push(status);
        paramIndex++;
      }
      if (priority) {
        whereConditions.push(`priority = $${paramIndex}`);
        queryParams.push(priority);
        paramIndex++;
      }
      if (search) {
        whereConditions.push(`(LOWER(title) LIKE $${paramIndex} OR LOWER(description) LIKE $${paramIndex})`);
        queryParams.push(`%${search.toLowerCase()}%`);
        paramIndex++;
      }

      const whereClause = whereConditions.join(' AND ');

      // Get total count
      const countQuery = `SELECT COUNT(*) FROM tasks WHERE ${whereClause}`;
      const countResult = await client.query(countQuery, queryParams);
      const total = parseInt(countResult.rows[0].count);

      // Get paginated tasks
      const tasksQuery = `
        SELECT id, user_id, title, description, status, priority, due_date, created_at, updated_at
        FROM tasks 
        WHERE ${whereClause}
        ORDER BY created_at DESC
        LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
      `;
      const tasksResult = await client.query(tasksQuery, [...queryParams, limitNum, offset]);

      // Transform the data to match the expected format
      const tasks = tasksResult.rows.map(row => ({
        id: row.id.toString(),
        userId: row.user_id,
        title: row.title,
        description: row.description,
        status: row.status,
        priority: row.priority,
        dueDate: row.due_date,
        createdAt: row.created_at,
        updatedAt: row.updated_at
      }));

      const responseBody = {
        success: true,
        message: 'Tasks retrieved successfully',
        data: tasks,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total: total,
          totalPages: Math.ceil(total / limitNum)
        }
      };
      res.json(responseBody);
      console.log(`[TaskController] ${req.method} ${req.originalUrl} - user: ${req.user?.id || 'N/A'} | Query: ${JSON.stringify(req.query)} | Params: ${JSON.stringify(req.params)} | Body: ${JSON.stringify(req.body)} | Status: ${res.statusCode} | Response: ${JSON.stringify(responseBody)}`);
    } catch (error) {
      console.error('Error in getTasks:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    } finally {
      client.release();
    }
  }


  async getTask(req, res) {
    const client = await pool.connect();
    try {
      const { id } = req.params;
      const userId = req.user.id;
      
      const result = await client.query(
        'SELECT id, user_id, title, description, status, priority, due_date, created_at, updated_at FROM tasks WHERE id = $1 AND user_id = $2',
        [id, userId]
      );
      
      if (result.rows.length === 0) {
        const responseBody = { success: false, message: 'Task not found' };
        res.status(404).json(responseBody);
        console.log(`[TaskController] ${req.method} ${req.originalUrl} - user: ${req.user?.id || 'N/A'} | Query: ${JSON.stringify(req.query)} | Params: ${JSON.stringify(req.params)} | Body: ${JSON.stringify(req.body)} | Status: ${res.statusCode} | Response: ${JSON.stringify(responseBody)}`);
        return;
      }
      
      const row = result.rows[0];
      const task = {
        id: row.id.toString(),
        userId: row.user_id,
        title: row.title,
        description: row.description,
        status: row.status,
        priority: row.priority,
        dueDate: row.due_date,
        createdAt: row.created_at,
        updatedAt: row.updated_at
      };
      
      const responseBody = { success: true, message: 'Task retrieved successfully', data: task };
      res.json(responseBody);
      console.log(`[TaskController] ${req.method} ${req.originalUrl} - user: ${req.user?.id || 'N/A'} | Query: ${JSON.stringify(req.query)} | Params: ${JSON.stringify(req.params)} | Body: ${JSON.stringify(req.body)} | Status: ${res.statusCode} | Response: ${JSON.stringify(responseBody)}`);
    } catch (error) {
      console.error('Error in getTask:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    } finally {
      client.release();
    }
  }


  async createTask(req, res) {
    const client = await pool.connect();
    try {
      const { title, description, status, priority, dueDate } = req.body;
      const userId = req.user.id;
      
      const result = await client.query(
        'INSERT INTO tasks (user_id, title, description, status, priority, due_date) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, user_id, title, description, status, priority, due_date, created_at, updated_at',
        [userId, title, description, status, priority, dueDate]
      );
      
      const row = result.rows[0];
      const newTask = {
        id: row.id.toString(),
        userId: row.user_id,
        title: row.title,
        description: row.description,
        status: row.status,
        priority: row.priority,
        dueDate: row.due_date,
        createdAt: row.created_at,
        updatedAt: row.updated_at
      };
      
      const responseBody = { success: true, message: 'Task created successfully', data: newTask };
      res.status(201).json(responseBody);
      console.log(`[TaskController] ${req.method} ${req.originalUrl} - user: ${req.user?.id || 'N/A'} | Query: ${JSON.stringify(req.query)} | Params: ${JSON.stringify(req.params)} | Body: ${JSON.stringify(req.body)} | Status: ${res.statusCode} | Response: ${JSON.stringify(responseBody)}`);
    } catch (error) {
      console.error('Error in createTask:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    } finally {
      client.release();
    }
  }


  async updateTask(req, res) {
    const client = await pool.connect();
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const { title, description, status, priority, dueDate } = req.body;
      
      // Check if task exists and belongs to user
      const checkResult = await client.query(
        'SELECT id FROM tasks WHERE id = $1 AND user_id = $2',
        [id, userId]
      );
      
      if (checkResult.rows.length === 0) {
        const responseBody = { success: false, message: 'Task not found' };
        res.status(404).json(responseBody);
        console.log(`[TaskController] ${req.method} ${req.originalUrl} - user: ${req.user?.id || 'N/A'} | Query: ${JSON.stringify(req.query)} | Params: ${JSON.stringify(req.params)} | Body: ${JSON.stringify(req.body)} | Status: ${res.statusCode} | Response: ${JSON.stringify(responseBody)}`);
        return;
      }
      
      // Update the task
      const result = await client.query(
        'UPDATE tasks SET title = $1, description = $2, status = $3, priority = $4, due_date = $5 WHERE id = $6 AND user_id = $7 RETURNING id, user_id, title, description, status, priority, due_date, created_at, updated_at',
        [title, description, status, priority, dueDate, id, userId]
      );
      
      const row = result.rows[0];
      const updatedTask = {
        id: row.id.toString(),
        userId: row.user_id,
        title: row.title,
        description: row.description,
        status: row.status,
        priority: row.priority,
        dueDate: row.due_date,
        createdAt: row.created_at,
        updatedAt: row.updated_at
      };
      
      const responseBody = { success: true, message: 'Task updated successfully', data: updatedTask };
      res.json(responseBody);
      console.log(`[TaskController] ${req.method} ${req.originalUrl} - user: ${req.user?.id || 'N/A'} | Query: ${JSON.stringify(req.query)} | Params: ${JSON.stringify(req.params)} | Body: ${JSON.stringify(req.body)} | Status: ${res.statusCode} | Response: ${JSON.stringify(responseBody)}`);
    } catch (error) {
      console.error('Error in updateTask:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    } finally {
      client.release();
    }
  }


  async deleteTask(req, res) {
    const client = await pool.connect();
    try {
      const { id } = req.params;
      const userId = req.user.id;
      
      const result = await client.query(
        'DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING id',
        [id, userId]
      );
      
      if (result.rows.length === 0) {
        const responseBody = { success: false, message: 'Task not found' };
        res.status(404).json(responseBody);
        console.log(`[TaskController] ${req.method} ${req.originalUrl} - user: ${req.user?.id || 'N/A'} | Query: ${JSON.stringify(req.query)} | Params: ${JSON.stringify(req.params)} | Body: ${JSON.stringify(req.body)} | Status: ${res.statusCode} | Response: ${JSON.stringify(responseBody)}`);
        return;
      }
      
      const responseBody = { success: true, message: 'Task deleted successfully' };
      res.json(responseBody);
      console.log(`[TaskController] ${req.method} ${req.originalUrl} - user: ${req.user?.id || 'N/A'} | Query: ${JSON.stringify(req.query)} | Params: ${JSON.stringify(req.params)} | Body: ${JSON.stringify(req.body)} | Status: ${res.statusCode} | Response: ${JSON.stringify(responseBody)}`);
    } catch (error) {
      console.error('Error in deleteTask:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    } finally {
      client.release();
    }
  }


  async bulkUpdateStatus(req, res) {
    const client = await pool.connect();
    try {
      const { ids, status } = req.body;
      const userId = req.user.id;
      
      if (!ids || !Array.isArray(ids) || ids.length === 0) {
        const responseBody = { success: false, message: 'Task IDs array is required' };
        res.status(400).json(responseBody);
        return;
      }
      
      // Update multiple tasks in one query
      const placeholders = ids.map((_, index) => `$${index + 3}`).join(',');
      const result = await client.query(
        `UPDATE tasks SET status = $1 WHERE user_id = $2 AND id = ANY(ARRAY[${placeholders}]) RETURNING id`,
        [status, userId, ...ids]
      );
      
      const updatedCount = result.rows.length;
      const responseBody = { success: true, message: 'Tasks updated successfully', updatedCount };
      res.json(responseBody);
      console.log(`[TaskController] ${req.method} ${req.originalUrl} - user: ${req.user?.id || 'N/A'} | Query: ${JSON.stringify(req.query)} | Params: ${JSON.stringify(req.params)} | Body: ${JSON.stringify(req.body)} | Status: ${res.statusCode} | Response: ${JSON.stringify(responseBody)}`);
    } catch (error) {
      console.error('Error in bulkUpdateStatus:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    } finally {
      client.release();
    }
  }

  async bulkDelete(req, res) {
    const client = await pool.connect();
    try {
      const { ids } = req.body;
      const userId = req.user.id;
      
      if (!ids || !Array.isArray(ids) || ids.length === 0) {
        const responseBody = { success: false, message: 'Task IDs array is required' };
        res.status(400).json(responseBody);
        return;
      }
      
      // Delete multiple tasks in one query
      const placeholders = ids.map((_, index) => `$${index + 2}`).join(',');
      const result = await client.query(
        `DELETE FROM tasks WHERE user_id = $1 AND id = ANY(ARRAY[${placeholders}]) RETURNING id`,
        [userId, ...ids]
      );
      
      const deletedCount = result.rows.length;
      const responseBody = { success: true, message: 'Tasks deleted successfully', deletedCount };
      res.json(responseBody);
      console.log(`[TaskController] ${req.method} ${req.originalUrl} - user: ${req.user?.id || 'N/A'} | Query: ${JSON.stringify(req.query)} | Params: ${JSON.stringify(req.params)} | Body: ${JSON.stringify(req.body)} | Status: ${res.statusCode} | Response: ${JSON.stringify(responseBody)}`);
    } catch (error) {
      console.error('Error in bulkDelete:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    } finally {
      client.release();
    }
  }

  async getStats(req, res) {
    const client = await pool.connect();
    try {
      const userId = req.user.id;
      
      // Get total count
      const totalResult = await client.query(
        'SELECT COUNT(*) FROM tasks WHERE user_id = $1',
        [userId]
      );
      const total = parseInt(totalResult.rows[0].count);
      
      // Get counts by status
      const statusResult = await client.query(
        'SELECT status, COUNT(*) FROM tasks WHERE user_id = $1 GROUP BY status',
        [userId]
      );
      
      const byStatus = {
        pending: 0,
        'in-progress': 0,
        completed: 0
      };
      
      statusResult.rows.forEach(row => {
        byStatus[row.status] = parseInt(row.count);
      });
      
      // Get counts by priority
      const priorityResult = await client.query(
        'SELECT priority, COUNT(*) FROM tasks WHERE user_id = $1 GROUP BY priority',
        [userId]
      );
      
      const byPriority = {
        low: 0,
        medium: 0,
        high: 0
      };
      
      priorityResult.rows.forEach(row => {
        byPriority[row.priority] = parseInt(row.count);
      });
      
      const stats = {
        total,
        byStatus,
        byPriority
      };
      
      const responseBody = { success: true, message: 'Task statistics retrieved successfully', data: stats };
      res.json(responseBody);
      console.log(`[TaskController] ${req.method} ${req.originalUrl} - user: ${req.user?.id || 'N/A'} | Query: ${JSON.stringify(req.query)} | Params: ${JSON.stringify(req.params)} | Body: ${JSON.stringify(req.body)} | Status: ${res.statusCode} | Response: ${JSON.stringify(responseBody)}`);
    } catch (error) {
      console.error('Error in getStats:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    } finally {
      client.release();
    }
  }
} 