import express, { Router } from 'express';
import { isAuthenticated } from '../controllers/middlewares/isAuthenticated';
import { getProfile, signin, signup, updateUserProfile } from '../controllers/user.controller';
const router : Router = express.Router();

router.route('/signup').post(signup);

router.route('/signin').post(signin);

router.route('/update-profile').patch(isAuthenticated, updateUserProfile);

router.route('/:username').get(getProfile);

export default router;