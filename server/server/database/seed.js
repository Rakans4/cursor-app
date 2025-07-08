import pool from './config.js';
import bcrypt from 'bcryptjs';

const seedData = async () => {
  const client = await pool.connect();
  
  try {
    // Check if test user exists
    const existingUser = await client.query('SELECT id FROM users WHERE username = $1', ['testuser']);
    let userId;
    if (existingUser.rows.length > 0) {
      userId = existingUser.rows[0].id;
      console.log('Test user already exists: username=testuser');
    } else {
      // Create a test user
      const hashedPassword = await bcrypt.hash('password123', 10);
      const userResult = await client.query(`
        INSERT INTO users (username, password) 
        VALUES ($1, $2) 
        RETURNING id
      `, ['testuser', hashedPassword]);
      userId = userResult.rows[0].id;
      console.log('Test user created: username=testuser, password=password123');
    }

    // Create sample tasks
    const sampleTasks = [
      {
        title: 'Complete project documentation',
        description: 'Write comprehensive documentation for the new feature implementation',
        status: 'in-progress',
        priority: 'high',
        due_date: '2024-02-15'
      },
      {
        title: 'Review code changes',
        description: 'Review pull requests and provide feedback to team members',
        status: 'pending',
        priority: 'medium',
        due_date: '2024-02-10'
      },
      {
        title: 'Update dependencies',
        description: 'Update npm packages to latest versions and fix any breaking changes',
        status: 'completed',
        priority: 'low',
        due_date: '2024-02-05'
      },
      {
        title: 'Plan next sprint',
        description: 'Organize and plan tasks for the upcoming development sprint',
        status: 'pending',
        priority: 'high',
        due_date: '2024-02-20'
      },
      {
        title: 'Fix bug in authentication',
        description: 'Investigate and fix the authentication issue reported by users',
        status: 'in-progress',
        priority: 'high',
        due_date: '2024-02-12'
      }
    ];

    for (const task of sampleTasks) {
      await client.query(`
        INSERT INTO tasks (user_id, title, description, status, priority, due_date)
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT DO NOTHING
      `, [userId, task.title, task.description, task.status, task.priority, task.due_date]);
    }

    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  } finally {
    client.release();
  }
};

const runSeed = async () => {
  try {
    await seedData();
    console.log('Seed completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  }
};

runSeed(); 