import express, { Router } from 'express';
import { isAuthenticated } from '../middlewares/isAuthenticated';
import { deleteComment, getComments, postComment } from '../controllers/comment.controller';
const router : Router = express.Router();

router.route('/').post(isAuthenticated, postComment);

router.route('/:projectid').get(getComments);

router.route('/:id').delete(isAuthenticated, deleteComment);

export default router;