import { Router } from 'express';
import verifyToken from '../middlewares/Verify.middleware.js'; 
import { getComments, getCommentsById, postComments, deleteComment, editComment } from "../controllers/comments.controller.js"

const router = Router();

router.get('/comments/:blogId', verifyToken, getComments);
router.get('/comments/:commentId', verifyToken, getCommentsById);
router.post('/comments',verifyToken, postComments);
router.put('/comments/:id',verifyToken, editComment);
router.delete('/comments/:id',verifyToken, deleteComment);  

export default router;