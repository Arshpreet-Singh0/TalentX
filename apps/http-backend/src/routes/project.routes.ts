import express, { Router } from 'express';
import { isAuthenticated } from '../middlewares/isAuthenticated';
import { getProjectById, getProjects, postproject } from '../controllers/project.controller';
const router : Router = express.Router();


router.route('/').post(isAuthenticated, postproject);

router.route('/').get(getProjects);

router.route('/:projectId').get(getProjectById);

export default router;