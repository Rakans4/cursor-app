import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../database/config.js';

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_key';

export class UserController {
  async signup(req, res) {
    const { username, password } = req.body;
    const client = await pool.connect();

    try {
      if (!username || !password) {
        const response = { success: false, message: 'Username and password are required.' };
        res.status(400).json(response);
        console.log(`[UserController] ${req.method} ${req.originalUrl} | Body: ${JSON.stringify({ username })} | Status: ${res.statusCode} | Response: ${JSON.stringify(response)}`);
        return;
      }

      // Check if user already exists
      const existingUser = await client.query('SELECT id FROM users WHERE username = $1', [username]);
      if (existingUser.rows.length > 0) {
        const response = { success: false, message: 'Username already exists.' };
        res.status(409).json(response);
        console.log(`[UserController] ${req.method} ${req.originalUrl} | Body: ${JSON.stringify({ username })} | Status: ${res.statusCode} | Response: ${JSON.stringify(response)}`);
        return;
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      await client.query(
        'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id, username',
        [username, hashedPassword]
      );

      const response = { success: true, message: 'User registered successfully.' };
      res.status(201).json(response);
      console.log(`[UserController] ${req.method} ${req.originalUrl} | Body: ${JSON.stringify({ username })} | Status: ${res.statusCode} | Response: ${JSON.stringify(response)}`);
    } catch (error) {
      console.error('Error in signup:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    } finally {
      client.release();
    }
  }

  async login(req, res) {
    const { username, password } = req.body;
    const client = await pool.connect();

    try {
      if (!username || !password) {
        const response = { success: false, message: 'Username and password are required.' };
        res.status(400).json(response);
        console.log(`[UserController] ${req.method} ${req.originalUrl} | Body: ${JSON.stringify({ username })} | Status: ${res.statusCode} | Response: ${JSON.stringify(response)}`);
        return;
      }

      const result = await client.query('SELECT id, username, password FROM users WHERE username = $1', [username]);
      if (result.rows.length === 0) {
        const response = { success: false, message: 'Invalid credentials.' };
        res.status(401).json(response);
        console.log(`[UserController] ${req.method} ${req.originalUrl} | Body: ${JSON.stringify({ username })} | Status: ${res.statusCode} | Response: ${JSON.stringify(response)}`);
        return;
      }

      const user = result.rows[0];
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        const response = { success: false, message: 'Invalid credentials.' };
        res.status(401).json(response);
        console.log(`[UserController] ${req.method} ${req.originalUrl} | Body: ${JSON.stringify({ username })} | Status: ${res.statusCode} | Response: ${JSON.stringify(response)}`);
        return;
      }

      const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
      const response = { success: true, token };
      res.json(response);
      console.log(`[UserController] ${req.method} ${req.originalUrl} | Body: ${JSON.stringify({ username })} | Status: ${res.statusCode} | Response: ${JSON.stringify(response)}`);
    } catch (error) {
      console.error('Error in login:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    } finally {
      client.release();
    }
  }
}
