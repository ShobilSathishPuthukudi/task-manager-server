import Task from '../models/Task.js';
import asyncHandler from 'express-async-handler';

const createTask = asyncHandler(async (req, res) => {
  req.body.user = req.user._id;

  const existingTask = await Task.findOne({
    user: req.user._id,
    title: req.body.title,
    isDeleted: false,
  });

  if (existingTask) {
    res.status(400);
    throw new Error(
      'Already have a task with this title. Try a different title'
    );
  }

  const task = await Task.create(req.body);

  res.status(201).json({
    success: true,
    message: 'Task created successfully',
    data: task,
  });
});

const getTaskByUser = asyncHandler(async (req, res) => {
  const tasks = await Task.getTaskByUser(req.user._id, req.query);

  res.status(200).json({
    success: true,
    message: 'success',
    count: tasks.length,
    data: tasks,
  });
});

const updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findOne({ _id: req.params.id, user: req.user._id });

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  Object.assign(task, req.body);

  if (!task.isModified()) {
    res.status(400);
    throw new Error('No changes detected compared to the existing task');
  }

  await task.save();

  res.status(200).json({
    success: true,
    message: 'Task updated successfully',
    data: task,
  });
});

const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findOne({ _id: req.params.id, user: req.user._id });

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  await task.softDelete();

  res.status(200).json({
    success: true,
    message: 'Task moved to trash',
  });
});

const getTrashTasks = asyncHandler(async (req, res) => {
  const tasks = await Task.find({
    user: req.user._id,
    isDeleted: true,
  });

  res.status(200).json({
    success: true,
    message: 'success',
    count: tasks.length,
    data: tasks,
  });
});

const restoreTask = asyncHandler(async (req, res) => {
  const trashedTask = await Task.findOne({
    _id: req.params.id,
    user: req.user._id,
    isDeleted: true,
  });

  if (!trashedTask) {
    res.status(404);
    throw new Error('Task not found in trash');
  }

  console.log(trashedTask.title);

  const duplicateActiveTask = await Task.findOne({
    user: req.user._id,
    title: trashedTask.title,
    isDeleted: false,
  });

  if (duplicateActiveTask) {
    res.status(400);
    throw new Error(
      'Cannot restore. An active task with the same title already exists. Change the title of active task to restore.'
    );
  }

  console.log(duplicateActiveTask);

  trashedTask.isDeleted = false;
  trashedTask.deletedAt = undefined;

  await trashedTask.save();

  res.status(200).json({
    success: true,
    message: 'Task restored successfully',
    data: trashedTask,
  });
});

const hardDeleteTask = asyncHandler(async (req, rs) => {
  const task = await Task.findOne({
    _id: req.params.id,
    user: req.user._id,
    isDeleted: true,
  });

  if (!task) {
    res.status(404);
    throw new Error('Task not found in the trash');
  }

  await task.hardDelete();

  res.status(200).json({
    success: true,
    message: 'Task deleted permanently',
  });
});

const hardDeleteAll = asyncHandler(async (req, res) => {
  const result = await Task.deleteMany({
    user: req.user._id,
    isDeleted: true,
  });

  if (result.deletedCount === 0) {
    res.status(200).json({
      success: true,
      message: 'Trash is already empty, nothing to delete',
    });
  }

  res.status(200).json({
    success: true,
    message: `Successfully cleared ${result.deletedCount} ${result.deletedCount === 1 ? 'task' : 'tasks'} from trash`,
  });
});

export {
  createTask,
  getTaskByUser,
  updateTask,
  deleteTask,
  getTrashTasks,
  restoreTask,
  hardDeleteTask,
  hardDeleteAll,
};
