import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
      index: true,
    },

    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      minLength: [3, 'Title must be at least 3 characters'],
      maxLength: [100, 'Title cannot be more than 100 characters'],
    },

    description: {
      type: String,
      trim: true,
      maxLength: [5000, 'Description cannot be more than 5000 characters'],
    },

    status: {
      type: String,
      enum: {
        values: ['pending', 'in-progress', 'completed'],
        message:
          '{VALUE} is not a valid status. Use: pending, in-progress, completed',
      },
      default: 'pending',
      index: true,
    },

    priority: {
      type: String,
      enum: {
        values: ['low', 'medium', 'high'],
        message: '{VALUE} is not a valid priority. Use low, medium, high',
      },
      default: 'medium',
      index: true,
    },

    dueDate: {
      type: Date,
    },

    tags: {
      type: [String],
      default: [],
    },

    category: {
      type: String,
      trim: true,
      default: 'general',
      index: true,
    },

    hasAttachments: {
      type: Boolean,
      default: false,
    },

    attachments: [
      {
        url: String,
        name: String,
        size: Number,
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    hasSubtasks: {
      type: Boolean,
      default: false,
    },

    subtasks: [
      {
        title: {
          type: String,
          trim: true,
          minLength: [3, 'Title must be at least 3 characters'],
          maxLength: [100, 'Title cannot be more than 100 characters'],
          required: true,
        },
        isCompleted: {
          type: Boolean,
          default: false,
        },
        completedAt: {
          type: Date,
        },
      },
    ],

    isRecurring: {
      type: Boolean,
      default: false,
    },

    recurring: {
      pattern: {
        type: String,
        enum: {
          values: ['daily', 'weekly', 'monthly', 'yearly', 'custom'],
          message:
            '{VALUE} is not a valid recurring pattern. Use daily, weekly, monthly, yearly, custom',
        },
      },
      interval: {
        type: Number,
        default: 1,
        min: [1, 'Minimum interval is 1'],
      },
      nextDue: {
        type: Date,
        index: true,
      },
      endDate: {
        type: Date,
      },
    },

    completedAt: {
      type: Date,
    },

    isDeleted: {
      type: Boolean,
      default: false,
      select: false,
    },

    deletedAt: {
      type: Date,
      select: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

taskSchema.pre(/^find/, async function () {
  if (this.getFilter().isDeleted !== true) {
    this.where({ isDeleted: { $ne: true } });
  }
});

taskSchema.pre('save', async function () {
  if (!this.isModified('status')) return;

  if (this.status === 'completed') {
    this.completedAt = Date.now();

    this.subtasks.forEach((sub) => {
      if (!sub.isCompleted) {
        sub.isCompleted = true;
        sub.completedAt = Date.now();
      }
    });
  } else {
    this.completedAt = undefined;
  }
});

taskSchema.index({ user: 1, isDeleted: 1, status: 1, createdAt: -1 });

taskSchema.virtual('isOverdue').get(function () {
  if (!this.dueDate || this.status === 'completed') return false;
  return this.dueDate.getTime() < Date.now();
});

taskSchema.virtual('daysRemaining').get(function () {
  if (!this.dueDate) return null;

  const daysRemaining = Math.ceil(
    (this.dueDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000)
  );

  return Math.max(0, daysRemaining);
});

taskSchema.methods.updateStatus = async function (newStatus) {
  if (!['pending', 'in-progress', 'completed'].includes(newStatus)) {
    throw new Error('Invalid status');
  }

  this.status = newStatus;

  return await this.save();
};

taskSchema.methods.markComplete = async function () {
  return this.updateStatus('completed');
};

taskSchema.methods.softDelete = async function () {
  this.isDeleted = true;
  this.deletedAt = Date.now();
  return await this.save();
};

taskSchema.statics.getTaskByUser = function (userId, options = {}) {
  const query = this.find({ user: userId });

  if (options.status) query.where('status', options.status);
  if (options.priority) query.where('priority', options.priority);

  if (options.search?.trim()) {
    const safeSearch = options.search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    query.or([
      { title: { $regex: safeSearch, $options: 'i' } },
      { description: { $regex: safeSearch, $options: 'i' } },
    ]);
  }

  const sortBy = options.sortBy || '-createdAt';
  query.sort(sortBy);

  const page = Math.max(1, parseInt(options.page) || 1);
  const limit = Math.max(1, parseInt(options.limit) || 20);
  const skip = (page - 1) * limit;

  query.skip(skip).limit(limit);

  return query;
};

const Task = mongoose.model('Task', taskSchema);

export default Task;
