import { Router } from 'express';
import {
  createStudent,
  getAllStudents,
  getStudentsByControlNumber,
} from '../controllers/studentController';
import { verifyToken } from '../utils/verifyToken';

const router = Router();

router.get('/', verifyToken, getAllStudents);
router.get('/:control_number', verifyToken, getStudentsByControlNumber);
router.post('/', verifyToken, createStudent);

export default router;
