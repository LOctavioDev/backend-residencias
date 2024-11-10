import { Router } from 'express';
import { singIn, singUp, googleAuth } from '../controllers/authController';

const router = Router();

router.post('/googleAuth', googleAuth);
router.post('/singUp', singUp);
router.post('/singIn', singIn);

export default router;