import express from 'express';
import protect from '../middleware/authMiddleware.js';
import validateRequest from '../middleware/validateRequest.js';
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

export default router;
