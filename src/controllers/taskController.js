import Task from '../models/Task.js';
import asyncHandler from 'express-async-handler';

const createTaskController = asyncHandler(async (req, res) => {
  req.body.user = req.user._id;

  const task = await Task.create(req.body);

  res.status(201).json({
    message: success,
    message: 'Task created successfully',
    data: task,
  });
});

const getTaskByUser = asyncHandler(async (req, res) => {
  const tasks = await Task.getTaskByUser(req.user._id, req.query);

  res.status(200).json({
    message: success,
    count: tasks.length,
    data: tasks,
  });
});

const updateTask = asyncHandler(async (req, res) => {
  const task = Task.findOne({ _id: req.params.id, user: req.user._id });

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  await task.save();

  res.status(200).json({
    success: true,
    message: 'Task updated successfully',
    data: task,
  });
});

const deleteTask = asyncHandler(async (req, res) => {
  const task = Task.findOne({ _id: req.params.id, user: req.user._id });

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
