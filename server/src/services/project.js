/* eslint-disable no-return-await */
const sequelize = require('@models');

const { models } = sequelize;
const projectModel = models.project;

const retrieveProjects = async userId => {
  const projects = await projectModel.findAll({
    attributes: [
      'id',
      'title',
      'color',
      'isFavorite',
      'isList',
      [sequelize.fn('COUNT', sequelize.col('sections.tasks.id')), 'taskCount'],
      [sequelize.col('sections.id'), 'defaultSectionId'],
    ],
    include: [
      {
        model: models.section,
        required: false,
        attributes: [],
        include: [
          {
            model: models.task,
            attributes: [],
            where: { isDone: false, parentId: null },
            required: false,
          },
        ],
      },
    ],
    where: { creatorId: userId },
    group: ['project.id'],
    order: [
      ['createdAt', 'ASC'],
      [models.section, 'position', 'ASC'],
    ],
  });

  return projects;
};

const retrieveById = async id => {
  const project = await projectModel.findByPk(id, {
    attributes: ['id', 'title', 'isList'],
    include: {
      model: models.section,
      include: {
        model: models.task,
        where: { parentId: null },
        include: [
          {
            model: models.task,
          },
        ],
        required: false,
      },
    },
    order: [
      [models.section, 'position', 'ASC'],
      [models.section, models.task, 'position', 'ASC'],
      [models.section, models.task, models.task, 'position', 'ASC'],
    ],
  });
  return project;
};

const create = async data => {
  const result = await sequelize.transaction(async t => {
    const project = await projectModel.create(data, {
      transaction: t,
    });
    const section = await models.section.create(
      { title: '기본 섹션', position: 0 },
      {
        transaction: t,
      },
    );
    await section.setProject(project, {
      transaction: t,
    });
    return section.projectId;
  });

  return result;
};

const findOrCreate = async data => {
  const [result] = await projectModel.findAll({ where: data });
  if (result) return true;

  const createResult = await create(data);
  return createResult;
};

const update = async ({ id, ...data }) => {
  const result = await projectModel.update(data, { where: { id } });

  return result === 1;
};

const remove = async ({ id }) => {
  const result = await projectModel.destroy({ where: { id } });

  return result === 1;
};

const updateSectionPositions = async orderedSections => {
  const result = await sequelize.transaction(async t => {
    return await Promise.all(
      orderedSections.map(async (sectionId, position) => {
        return await models.section.update(
          { position },
          { where: { id: sectionId } },
          { transaction: t },
        );
      }),
    );
  });

  return result.length === orderedSections.length;
};
module.exports = {
  retrieveProjects,
  retrieveById,
  create,
  findOrCreate,
  update,
  remove,
  updateSectionPositions,
};