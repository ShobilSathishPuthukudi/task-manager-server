import express from 'express';
import protect from '../middleware/authMiddleware.js';
import validateRequest from '../middleware/validateRequest.js';
import { trashLimiter } from '../middleware/rateLimiter.js';
import {
  getTasksQueryValidator,
  createTaskValidator,
  updateTaskValidator,
  taskIdValidator,
} from '../validators/taskValidator.js';
import {
  getTaskByUser,
  createTask,
  updateTask,
  deleteTask,
  getTrashTasks,
  restoreTask,
  hardDeleteTask,
  hardDeleteAll,
} from '../controllers/taskController.js';

const router = express.Router();

router.use(protect);

router.get('/', getTasksQueryValidator, validateRequest, getTaskByUser);

router.post('/', createTaskValidator, validateRequest, createTask);

router.patch(
  '/:id',
  taskIdValidator,
  updateTaskValidator,
  validateRequest,
  updateTask
);

router.delete('/:id', taskIdValidator, validateRequest, deleteTask);

router.get('/trash', getTasksQueryValidator, validateRequest, getTrashTasks);

router.patch('/:id/restore', taskIdValidator, validateRequest, restoreTask);

router.delete(
  '/:id/permanent',
  trashLimiter,
  taskIdValidator,
  validateRequest,
  hardDeleteTask
);

router.delete('/trash/empty', trashLimiter, hardDeleteAll);

export default router;
