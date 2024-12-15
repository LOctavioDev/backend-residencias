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
  getStudentsByActivity,
  addCompanyToHistory,
  editCompanyInHistory,
  getStudentCompanyHistory,
  deleteCompanyFromHistory
  
} from '../controllers/studentController';
import { verifyToken } from '../utils/verifyToken';

const router = Router();

router.get('/', verifyToken, getAllStudents);
router.get('/:control_number', verifyToken, getStudentsByControlNumber);
// * Define la ruta en tu archivo de rutas
router.get('/:id/company-history', verifyToken, getStudentCompanyHistory);

router.post('/', verifyToken, createStudent);
router.put('/:control_number', verifyToken, updateStudent);
router.put('/:control_number/company-history', verifyToken, addCompanyToHistory);
router.put('/:control_number/company-history/edit', verifyToken, editCompanyInHistory);
router.delete('/:control_number/company-history/delete', verifyToken, deleteCompanyFromHistory);
router.delete('/all', verifyToken, deleteAllStudents);

router.get('/students/city', verifyToken, getStudentsByCity);
router.get('/students/generation', verifyToken, getStudentsByGeneration);
router.get('/students/jobType', verifyToken, getJobTypeData);
router.get('/students/activity', verifyToken, getStudentsByActivity);

export default router;
