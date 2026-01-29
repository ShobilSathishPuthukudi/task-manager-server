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

export { createTask, getTaskByUser, updateTask, deleteTask };
