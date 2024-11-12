import  { Request, Response } from 'express';
import Student from '../models/Student';

// * CREATE A NEW STUDENT

export const createStudent = async (req: Request, res: Response) => {
  try {
    const student = new Student(req.body);
    console.log(student);
    
    await student.save();
    res.status(201).json(student);
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

// * GET ALL STUDENTS

export const getAllStudents = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.userId;  

    const students = await Student.find();
    res.status(200).json(students);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};


// * GET SINGLE STUDENT
export const getStudent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const student = await Student.findById(id);
    res.status(200).json(student);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// GET STUDENT BY CONTROL NUMBER
export const getStudentsByControlNumber = async (req: Request, res: Response): Promise<void> => {
  try {
    const student = await Student.findOne({ control_number: req.params.control_number });
    if (!student) {
      res.status(404).json({ error: 'Student not found' });
      return;
    }

    res.status(200).json(student);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
