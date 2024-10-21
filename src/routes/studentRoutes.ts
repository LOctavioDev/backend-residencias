import { Router } from 'express';
import { createStudent, getAllStudents } from '../controllers/studentController';

const router = Router();

router.get('/', getAllStudents);
router.post('/', createStudent);

export default router;
