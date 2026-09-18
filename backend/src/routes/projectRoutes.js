import express from 'express'
import { createProject, updateProject, deleteProject, getProjectById, getAllProjects } from '../controllers/projectController.js'
import authMiddleware from '../middlewares/authMiddleware.js'
import { getAllProjectTasks } from '../controllers/taskController.js'

const router = express.Router()

router.post('/create/', authMiddleware, createProject)
router.put('/update/:id', authMiddleware, updateProject)
router.delete('/delete/:id', authMiddleware, deleteProject)
router.get('/', authMiddleware, getAllProjects)
router.get('/:id', authMiddleware, getProjectById)
router.get('/:id/tasks', authMiddleware, getAllProjectTasks)

export default router