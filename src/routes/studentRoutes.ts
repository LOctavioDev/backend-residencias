import { Router } from 'express';
import {
  createStudent,
  getAllStudents,
  getStudentsByControlNumber,
  getStudentsByCity,
  getStudentsByGeneration,
  getJobTypeData,
  updateStudent,
  deleteAllStudents,
  getStudentsByActivity
} from '../controllers/studentController';
import { verifyToken } from '../utils/verifyToken';

const router = Router();

router.get('/', verifyToken, getAllStudents);
router.get('/:control_number', verifyToken, getStudentsByControlNumber);
router.post('/', verifyToken, createStudent);
router.put('/:control_number', verifyToken, updateStudent);
router.delete('/all', verifyToken, deleteAllStudents);

router.get('/students/city', verifyToken, getStudentsByCity);
router.get('/students/generation', verifyToken, getStudentsByGeneration);
router.get('/students/jobType', verifyToken, getJobTypeData);
router.get('/students/activity', verifyToken, getStudentsByActivity);

export default router;
