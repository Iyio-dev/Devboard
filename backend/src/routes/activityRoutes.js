import express from 'express';
import { getActivities } from '../controllers/activityController.js';
import authMiddleware from '../middlewares/authMiddleware.js'

const router = express.Router();

router.get('/', authMiddleware, getActivities);

export default router;