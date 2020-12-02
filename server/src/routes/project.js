const router = require('express').Router();
const projectController = require('@controllers/project');
const taskController = require('@controllers/task');

router.get('/', projectController.getProjects);
// TODO: router.get('/today', projectController.getTodayProject);
router.get('/:projectId', projectController.getProjectById);
router.post('/', projectController.createProject);
router.put('/:projectId', projectController.updateProject);
router.patch('/:projectId', projectController.updateProject);
router.delete('/:projectId', projectController.deleteProject);

router.post('/:projectId/section', projectController.createSection);
router.patch(
  '/:projectId/section/:sectionId/position',
  projectController.updateSectionTaskPositions,
);
router.put('/:projectId/section/:sectionId', projectController.updateSection);
router.delete('/:projectId/section/:sectionId', projectController.deleteSection);

router.post('/:projectId/section/:sectionId/task', taskController.createTask);

module.exports = router;
