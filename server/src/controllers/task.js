const sequelize = require('@models');
const { models } = require('@models');
const { asyncTryCatch } = require('@utils/async-try-catch');
const { responseHandler } = require('@utils/handler');
const { isValidDueDate } = require('@utils/date');

const getTasks = asyncTryCatch(async (req, res) => {
  const tasks = await models.task.findAll({
    include: [
      'labels',
      'priority',
      'alarm',
      'bookmarks',
      {
        model: models.task,
        include: ['labels', 'priority', 'alarm', 'bookmarks'],
      },
    ],
    order: [[models.task, 'position', 'ASC']],
  });

  responseHandler(res, 200, tasks);
});

const getTaskById = asyncTryCatch(async (req, res) => {
  const task = await models.task.findByPk(req.params.taskId, {
    include: [
      'labels',
      'priority',
      'alarm',
      'bookmarks',
      {
        model: models.task,
        include: ['labels', 'priority', 'alarm', 'bookmarks'],
      },
    ],
    order: [[models.task, 'position', 'ASC']],
  });

  responseHandler(res, 201, task);
});

const createTask = asyncTryCatch(async (req, res) => {
  const { labelIdList, dueDate, ...rest } = req.body;

  if (!isValidDueDate(dueDate)) {
    const err = new Error('유효하지 않은 dueDate');
    err.status = 400;
    throw err;
  }

  await sequelize.transaction(async t => {
    const task = await models.task.create({ dueDate, ...rest }, { transaction: t });
    await task.setLabels(JSON.parse(labelIdList), { transaction: t });
  });

  responseHandler(res, 201, { message: 'ok' });
});

const updateTask = asyncTryCatch(async (req, res) => {
  const { labelIdList, dueDate, ...rest } = req.body;

  if (!isValidDueDate(dueDate)) {
    const err = new Error('유효하지 않은 dueDate');
    err.status = 400;
    throw err;
  }

  const { taskId } = req.params;
  await sequelize.transaction(async t => {
    await models.task.update(
      { dueDate, ...rest },
      {
        where: { id: taskId },
      },
      { transaction: t },
    );

    const task = await models.task.findByPk(taskId, { transaction: t });
    if (labelIdList) {
      await task.setLabels(JSON.parse(labelIdList), { transaction: t });
    }
  });

  responseHandler(res, 201, { message: 'ok' });
});

const deleteTask = asyncTryCatch(async (req, res) => {
  await models.task.destroy({
    where: {
      id: req.params.taskId,
    },
  });

  responseHandler(res, 201, {
    message: 'ok',
  });
});

const getComments = asyncTryCatch(async (req, res) => {
  const task = await models.task.findByPk(req.params.taskId);
  const comments = await task.getComments();

  responseHandler(res, 201, comments);
});

const createComment = asyncTryCatch(async (req, res) => {
  const { taskId } = req.params;
  await models.comment.create({ ...req.body, taskId });

  responseHandler(res, 201, {
    message: 'ok',
  });
});

const updateComment = asyncTryCatch(async (req, res) => {
  await models.comment.update(req.body, {
    where: {
      id: req.params.commentId,
    },
  });

  responseHandler(res, 201, {
    message: 'ok',
  });
});

const deleteComment = asyncTryCatch(async (req, res) => {
  await models.comment.destroy({
    where: {
      id: req.params.commentId,
    },
  });

  responseHandler(res, 201, {
    message: 'ok',
  });
});

module.exports = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  getComments,
  createComment,
  updateComment,
  deleteComment,
};
