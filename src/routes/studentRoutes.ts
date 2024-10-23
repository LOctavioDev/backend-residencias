import { Router } from 'express';
import { createStudent, getAllStudents, getStudentsByControlNumber } from '../controllers/studentController';

const router = Router();

router.get('/', getAllStudents);
router.get('/:control_number', getStudentsByControlNumber);
router.post('/', createStudent);

export default router;
