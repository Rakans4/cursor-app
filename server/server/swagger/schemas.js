/**
 * @swagger
 * components:
 *   schemas:
 *     Task:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - status
 *         - priority
 *         - dueDate
 *       properties:
 *         id:
 *           type: string
 *           description: Unique task identifier
 *           example: "abc123def456"
 *         title:
 *           type: string
 *           description: Task title
 *           example: "Complete project documentation"
 *         description:
 *           type: string
 *           description: Task description
 *           example: "Write comprehensive documentation for the new feature"
 *         status:
 *           type: string
 *           enum: [pending, in-progress, completed]
 *           description: Task status
 *           example: "in-progress"
 *         priority:
 *           type: string
 *           enum: [low, medium, high]
 *           description: Task priority
 *           example: "high"
 *         dueDate:
 *           type: string
 *           format: date
 *           description: Task due date
 *           example: "2024-02-15"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Task creation timestamp
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Task last update timestamp
 *     CreateTaskRequest:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - status
 *         - priority
 *         - dueDate
 *       properties:
 *         title:
 *           type: string
 *           description: Task title
 *           example: "Complete project documentation"
 *         description:
 *           type: string
 *           description: Task description
 *           example: "Write comprehensive documentation for the new feature"
 *         status:
 *           type: string
 *           enum: [pending, in-progress, completed]
 *           description: Task status
 *           example: "in-progress"
 *         priority:
 *           type: string
 *           enum: [low, medium, high]
 *           description: Task priority
 *           example: "high"
 *         dueDate:
 *           type: string
 *           format: date
 *           description: Task due date
 *           example: "2024-02-15"
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: User ID
 *           example: 1
 *         username:
 *           type: string
 *           description: Unique username
 *           example: "john_doe"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: User creation timestamp
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: User last update timestamp
 *     LoginRequest:
 *       type: object
 *       required:
 *         - username
 *         - password
 *       properties:
 *         username:
 *           type: string
 *           description: Username
 *           example: "john_doe"
 *         password:
 *           type: string
 *           description: User password
 *           example: "password123"
 *     SignupRequest:
 *       type: object
 *       required:
 *         - username
 *         - password
 *       properties:
 *         username:
 *           type: string
 *           description: Unique username
 *           example: "john_doe"
 *         password:
 *           type: string
 *           description: User password (min 6 characters)
 *           example: "password123"
 *     BulkStatusRequest:
 *       type: object
 *       required:
 *         - ids
 *         - status
 *       properties:
 *         ids:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of task IDs to update
 *           example: ["1", "2", "3"]
 *         status:
 *           type: string
 *           enum: [pending, in-progress, completed]
 *           description: New status for all tasks
 *           example: "completed"
 *     BulkDeleteRequest:
 *       type: object
 *       required:
 *         - ids
 *       properties:
 *         ids:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of task IDs to delete
 *           example: ["1", "2", "3"]
 */ 