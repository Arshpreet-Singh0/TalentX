import express, { Router } from 'express';
import { isAuthenticated } from '../middlewares/isAuthenticated';
import { getProjectById, getProjects, postproject } from '../controllers/project.controller';
import { upload } from '../middlewares/multer';
const router : Router = express.Router();


router.route('/').post(isAuthenticated, upload, postproject);

router.route('/get').get(getProjects);

router.route('/:projectId').get(getProjectById);

export default router;