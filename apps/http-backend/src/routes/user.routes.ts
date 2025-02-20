import express, { Router } from 'express';
import { isAuthenticated } from '../middlewares/isAuthenticated';
import { getProfile, signin, signup, updateUserProfile } from '../controllers/user.controller';import { uploadSingle } from '../middlewares/upload';
import { upload } from '../middlewares/multer';

const router : Router = express.Router();

router.route('/signup').post(signup);

router.route('/signin').post(signin);

router.route('/update-profile').patch(isAuthenticated, upload,  updateUserProfile);

router.route('/:username').get(getProfile);

export default router;