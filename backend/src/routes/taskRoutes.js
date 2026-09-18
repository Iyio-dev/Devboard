import express from 'express'
import { createTask, updateTask, deleteTask, getTaskById, getAllTasks } from '../controllers/taskController.js'
import authMiddleware from '../middlewares/authMiddleware.js'

export const router = express.Router()

router.post('/:id/create/', authMiddleware, createTask)
router.put('/update/:id', authMiddleware, updateTask)
router.delete('/delete/:id', authMiddleware, deleteTask)
router.get('/all', authMiddleware, getAllTasks)
router.get('/:id', authMiddleware, getTaskById)

export default router