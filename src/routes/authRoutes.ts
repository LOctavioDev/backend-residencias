import { Router } from 'express';
import { singIn, singUp, googleAuth, updateAdmin, login } from '../controllers/authController';

const router = Router();

router.post('/googleAuth', googleAuth);
router.post('/login', login);
router.post('/singUp', singUp);
router.post('/singIn', singIn);

router.put('/admin', updateAdmin);
export default router;
