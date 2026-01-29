import { body, query, param } from 'express-validator';

const hasAttachmentsSet = (req) => req.body.hasAttachments === true;
const hasSubtaskFieldSet = (req) => req.body.hasSubtasks === true;

const attachmentFieldCondition = (value, { req }) => {
  const hasAttachments = req.body.hasAttachments === true;
  const hasValidAttachmentArray = req.body.attachments;

  if (req.body.hasAttachments === false && value) {
    throw new Error(
      'Cannot provide attachment config if hasAttachments is false'
    );
  }

  if (hasAttachments && !value) {
    throw new Error('Attachement config is required if hasAttachment is true');
  }

  return hasAttachments && hasValidAttachmentArray;
};

const subtaskFieldCondition = (value, { req }) => {
  const hasSubtasks = req.body.hasSubtasks === true;
  const hasValidSubtaskArray = req.body.subtasks;

  if (req.body.hasSubtasks === false && value) {
    throw new Error('Subtask confiig is not allowed when hasSubtasks is false');
  }

  if (hasSubtasks && !value) {
    throw new Error('Subtask config is required when hasSubtasks is true');
  }

  return hasSubtasks && hasValidSubtaskArray;
};

const createTaskValidator = [
  body('user').optional().isMongoId().withMessage('Invalid userId format'),

  body('title')
    .trim()
    .exists({ checkFalsy: true })
    .withMessage('Title is required')
    .bail()
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be between 3 and 100 characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 5000 })
    .withMessage('Description can not be more than 5000 caharacters'),

  body('status')
    .optional()
    .isIn(['pending', 'in-progress', 'completed'])
    .withMessage('Invalid status value, use pending, in-progress, completed'),

  body('priority')
    .trim()
    .exists({ checkFalsy: true })
    .withMessage('Priority can not be empty')
    .bail()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Invalid priority value, use low, medium, high'),

  body('dueDate')
    .trim()
    .exists({ checkFalsy: true })
    .withMessage('Due date can not be empty')
    .bail()
    .isISO8601()
    .withMessage('Due date must be a valid date')
    .custom((value) => {
      if (!value) return true;
      const today = new Date().toISOString().split('T')[0];

      if (value < today) {
        throw new Error('Due date must be in the future');
      }
      return true;
    })
    .toDate(),

  //================== TAGS ===============//

  body('tags') //
    .optional()
    .isArray({ max: 10 })
    .withMessage('Tags must be an array (max 10 items)'),

  body('tags.*')
    .optional()
    .trim()
    .exists({ checkFalsy: true })
    .withMessage('Tag cannot be empty')
    .bail()
    .isString()
    .withMessage('Tag must be a string')
    .isLength({ min: 1, max: 50 })
    .withMessage('Each tag must be 1-50 character'),

  //================== CATEGORY ===============//

  body('category')
    .optional()
    .isLength({ min: 1, max: 50 })
    .withMessage('Category must be between 1-20 characters'),

  //================== ATTACHMENTS ===============//

  body('hasAttachments')
    .optional()
    .isBoolean()
    .withMessage('Value of hasAttachments must be a boolean'),

  body('attachments').if((val, { req }) => {
    if (req.body.hasAttachments === false && val) {
      throw new Error('Cannot provide attachments if hasAttachments is false');
    }
    return false;
  }),

  body('attachments')
    .if(hasAttachmentsSet)
    .exists({ checkFalsy: true })
    .withMessage('Attachments are required when hasAttachments is true')
    .bail()
    .isArray({ min: 1, max: 10 })
    .withMessage('Attachment must be an array of 1-10 files'),

  body('attachments.*.url')
    .if(hasAttachmentsSet)
    .trim()
    .exists({ checkFalsy: true })
    .withMessage('Attachment url is required')
    .bail()
    .isURL()
    .withMessage('Attachment url must be valid'),

  body('attachments.*.name')
    .if(attachmentFieldCondition)
    .trim()
    .exists({ checkFalsy: true })
    .withMessage('Attachment name is required')
    .bail()
    .isLength({ max: 200 })
    .withMessage('Attachment name cannot be more than 200 characters'),

  body('attachments.*.size')
    .if(attachmentFieldCondition)
    .exists()
    .withMessage('Attachment size is required')
    .bail()
    .isInt({ min: 1 })
    .withMessage('Attachment size must be a positive integer')
    .toInt(),

  body('attachments.*.uploadedAt')
    .not()
    .exists()
    .withMessage('uploadedAt is system managed'),

  //================== SUBTASKS ===============//

  body('hasSubtasks')
    .optional()
    .isBoolean()
    .withMessage('Value of hasSubtasks must be a boolean'),

  body('subtasks').if((val, { req }) => {
    if (req.body.hasSubtasks === false && val) {
      throw new Error('Cannot provide attachments if hasAttachments is false');
    }
    return false;
  }),

  body('subtasks') //
    .if(hasSubtaskFieldSet)
    .exists({ checkFalsy: true })
    .withMessage('Subtask config is required when hasSubtasks is true')
    .isArray({ min: 1, max: 20 })
    .withMessage('Subtask must be an array with min 1 and max 20 items'),

  body('subtasks.*.title')
    .if(subtaskFieldCondition)
    .trim()
    .exists({ checkFalsy: true })
    .withMessage('Subtask title is required')
    .bail()
    .isLength({ min: 3, max: 100 })
    .withMessage('Subtask title must be between 3-100 characters'),

  body('subtasks.*.isCompleted')
    .if(subtaskFieldCondition)
    .exists()
    .withMessage('Subtask can not be empty')
    .bail()
    .isBoolean()
    .withMessage('Subtask isCompleted must be a boolean'),

  body('subtasks.*.completedAt')
    .not()
    .exists()
    .withMessage('CompletedAt is system managed'),

  //================== RECURRING ===============//

  body('isRecurring')
    .optional()
    .default(false)
    .isBoolean()
    .withMessage('isRecurring must be a boolean'),

  body('recurring')
    .optional()
    .custom((value, { req }) => {
      const isRecurring = req.body.isRecurring;

      if (isRecurring === true && !value) {
        throw new Error(
          'Recurring config is required when isRecurring is true'
        );
      }
      if (req.body.isRecurring === false && value) {
        throw new Error(
          'Recurring config is not allowed when isRecurring is false'
        );
      }
      return true;
    }),

  body('recurring.pattern')
    .if(({ req }) => req.body.isRecurring === true)
    .trim()
    .exists({ checkFalsy: true })
    .withMessage('Recurring pattern is required for recurring tasks')
    .bail()
    .isIn(['daily', 'weekly', 'monthly', 'yearly', 'custom'])
    .withMessage(
      'Invalid recurring pattern, use daily, weekly, monthly, yearly or custom'
    ),

  body('recurring.interval')
    .if(({ req }) => req.body.isRecurring === true)
    .trim()
    .exists({ checkFalsy: true })
    .withMessage('Recurring interval is required for recurring tasks')
    .bail()
    .isInt({ min: 1 })
    .withMessage('Recurring interval must be atleast 1')
    .toInt(),

  body('recurring.nextDue')
    .if((value, { req }) => req.body.isRecurring === true)
    .trim()
    .exists({ checkFalsy: true })
    .withMessage('Next due date is required for recurring tasks')
    .bail()
    .isISO8601()
    .withMessage('Invalid nextDue format')
    .custom((value) => {
      const today = new Date().toISOString().split('T')[0];
      const nextDue = new Date(value).toISOString().split('T')[0];

      if (nextDue < today) {
        throw new Error('NextDue must be in the future');
      }
      return true;
    })
    .toDate(),

  body('recurring.endDate')
    .optional()
    .trim()
    .if((value) => value !== undefined)
    .notEmpty()
    .withMessage('End date cannot be empty if provided')
    .bail()
    .isISO8601()
    .withMessage('Invalid end date format')
    .bail()
    .custom((value, { req }) => {
      const nextDueStr = req.body.recurring?.nextDue;

      if (!nextDueStr)
        throw new Error('Next due date is required to validate end date');

      const endDateObj = new Date(value);
      const nextDueObj = new Date(nextDueStr);

      const endDate = endDateObj.toISOString().split('T')[0];
      const nextDue = nextDueObj.toISOString().split('T')[0];

      if (endDate <= nextDue) {
        throw new Error('End date must be after due date');
      }
      return true;
    })
    .toDate(),

  //================== SYSTEM-MANAGED ===============//

  body('completedAt')
    .not()
    .exists()
    .withMessage('completedAt is system managed'),

  body('isDeleted').not().exists().withMessage('isDeleted is system managed'),

  body('deletedAt').not().exists().withMessage('deletedAt is system managed'),
];

const taskIdValidator = [
  param('id').isMongoId().withMessage('Invalid task id format'),
];

const updateTaskValidator = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be between 3-100 characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ min: 3, max: 5000 })
    .withMessage('Description must be between 3-5000 characters'),

  body('status')
    .optional()
    .trim()
    .isIn(['pending', 'in-progress', 'completed'])
    .withMessage('Invalid status value, use pending, in-progress, completed'),

  body('priority')
    .optional()
    .trim()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Invalid priority value, use low, medium, high'),

  body('dueDate')
    .optional()
    .bail()
    .isISO8601()
    .withMessage('Due date must be a valid date')
    .custom((value) => {
      if (!value) return true;
      const today = new Date().toISOString().split('T')[0];

      if (value < today) {
        throw new Error('Due date must be in the future');
      }
      return true;
    })
    .toDate(),

  //================== TAGS ===============//

  body('tags') //
    .optional()
    .isArray({ max: 10 })
    .withMessage('Tags must be an array (max 10 items)'),

  body('tags.*')
    .optional()
    .isString()
    .withMessage('Tag must be a string')
    .isLength({ min: 1, max: 50 })
    .withMessage('Each tag must be 1-50 character'),

  //================== CATEGORY ===============//

  body('category')
    .optional()
    .bail()
    .isLength({ max: 50 })
    .withMessage('Category cannot be more than 50 characters'),

  //================== ATTACHMENTS ===============//

  body('hasAttachments')
    .optional()
    .isBoolean()
    .withMessage('Value of hasAttachments must be a boolean'),

  body('attachments').if((val, { req }) => {
    if (req.body.hasAttachments === false && val) {
      throw new Error('Cannot provide attachments if hasAttachments is false');
    }
    return false;
  }),

  body('attachments')
    .optional()
    .custom((val, { req }) => {
      if (req.body.hasAttachments === false && val) {
        throw new Error('Set hasAttachments to true to add attachments');
      }
      return true;
    })
    .isArray({ min: 1, max: 10 })
    .withMessage('Attachment must be an array of 1-10 files'),

  body('attachments.*.url')
    .if(attachmentFieldCondition)
    .trim()
    .exists({ checkFalsy: true })
    .withMessage('Attachment url is required')
    .bail()
    .isURL()
    .withMessage('Attachment url must be valid'),

  body('attachments.*.name')
    .if(attachmentFieldCondition)
    .trim()
    .exists({ checkFalsy: true })
    .withMessage('Attachment name is required')
    .bail()
    .isLength({ max: 200 })
    .withMessage('Attachment name cannot be more than 200 characters'),

  body('attachments.*.size')
    .if(attachmentFieldCondition)
    .exists()
    .withMessage('Attachment size is required')
    .bail()
    .isInt({ min: 1 })
    .withMessage('Attachment size must be a positive integer')
    .toInt(),

  body('attachments.*.uploadedAt')
    .not()
    .exists()
    .withMessage('uploadedAt is system managed'),

  //================== SUBTASKS ===============//

  body('hasSubtasks')
    .optional()
    .isBoolean()
    .withMessage('Value of hasSubtasks must be a boolean'),

  body('subtasks').if((val, { req }) => {
    if (req.body.hasSubtasks === false && val) {
      throw new Error('Cannot provide subtasks if hasSubtasks is false');
    }
    return false;
  }),

  body('subtasks') //
    .if(hasSubtaskFieldSet)
    .exists({ checkFalsy: true })
    .withMessage('Subtask config is required when hasSubtasks is true')
    .isArray({ min: 1, max: 20 })
    .withMessage('Subtask must be an array with min 1 and max 20 items'),

  body('subtasks.*.title')
    .if(subtaskFieldCondition)
    .trim()
    .exists({ checkFalsy: true })
    .withMessage('Subtask title is required')
    .bail()
    .isLength({ min: 3, max: 100 })
    .withMessage('Subtask title must be between 3-100 characters'),

  body('subtasks.*.isCompleted')
    .if(subtaskFieldCondition)
    .exists()
    .withMessage('Subtask can not be empty')
    .bail()
    .isBoolean()
    .withMessage('Subtask isCompleted must be a boolean'),

  body('subtasks.*.completedAt')
    .not()
    .exists()
    .withMessage('CompletedAt is system managed'),

  //================== RECURRING ===============//

  body('isRecurring')
    .optional()
    .default(false)
    .isBoolean()
    .withMessage('isRecurring must be a boolean'),

  body('recurring')
    .optional()
    .custom((value, { req }) => {
      const isRecurring = req.body.isRecurring;

      if (isRecurring === true && !value) {
        throw new Error(
          'Recurring config is required when isRecurring is true'
        );
      }
      if (req.body.isRecurring === false && value) {
        throw new Error(
          'Recurring config is not allowed when isRecurring is false'
        );
      }
      return true;
    }),

  body('recurring.pattern')
    .if(({ req }) => req.body.isRecurring === true)
    .trim()
    .exists({ checkFalsy: true })
    .withMessage('Recurring pattern is required for recurring tasks')
    .bail()
    .isIn(['daily', 'weekly', 'monthly', 'yearly', 'custom'])
    .withMessage(
      'Invalid recurring pattern, use daily, weekly, monthly, yearly or custom'
    ),

  body('recurring.interval')
    .if(({ req }) => req.body.isRecurring === true)
    .trim()
    .exists({ checkFalsy: true })
    .withMessage('Recurring interval is required for recurring tasks')
    .bail()
    .isInt({ min: 1 })
    .withMessage('Recurring interval must be atleast 1')
    .toInt(),

  body('recurring.nextDue')
    .if((value, { req }) => req.body.isRecurring === true)
    .trim()
    .exists({ checkFalsy: true })
    .withMessage('Next due date is required for recurring tasks')
    .bail()
    .isISO8601()
    .withMessage('Invalid nextDue format')
    .custom((value) => {
      const today = new Date().toISOString().split('T')[0];
      const nextDue = new Date(value).toISOString().split('T')[0];

      if (nextDue < today) {
        throw new Error('NextDue must be in the future');
      }
      return true;
    })
    .toDate(),

  body('recurring.endDate')
    .optional()
    .trim()
    .if((value) => value !== undefined)
    .notEmpty()
    .withMessage('End date cannot be empty if provided')
    .bail()
    .isISO8601()
    .withMessage('Invalid end date format')
    .bail()
    .custom((value, { req }) => {
      const nextDueStr = req.body.recurring?.nextDue;

      if (!nextDueStr)
        throw new Error('Next due date is required to validate end date');

      const endDateObj = new Date(value);
      const nextDueObj = new Date(nextDueStr);

      const endDate = endDateObj.toISOString().split('T')[0];
      const nextDue = nextDueObj.toISOString().split('T')[0];

      if (endDate <= nextDue) {
        throw new Error('End date must be after due date');
      }
      return true;
    })
    .toDate(),

  //================== SYSTEM-MANAGED ===============//

  body('user')
    .not()
    .exists()
    .withMessage('User field cannot be changed after creating'),

  body('completedAt')
    .not()
    .exists()
    .withMessage('completedAt is system managed'),

  body('isDeleted').not().exists().withMessage('isDeleted is system managed'),

  body('deletedAt').not().exists().withMessage('deletedAt is system managed'),
];

const getTasksQueryValidator = [
  query('status')
    .optional()
    .isIn(['pending', 'in-progress', 'completed'])
    .withMessage('Invalid status filter'),

  query('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Invalid priority filter'),

  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),

  query('search').optional().trim().escape(),
];

export {
  createTaskValidator,
  updateTaskValidator,
  getTasksQueryValidator,
  taskIdValidator,
};
