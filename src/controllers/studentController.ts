import { Request, Response } from 'express';
import Student from '../models/Student';

// * CREATE A NEW STUDENT

export const createStudent = async (req: Request, res: Response) => {
  try {
    const student = new Student(req.body);
    await student.save();
    res.status(201).json(student);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllStudents = async (req: Request, res: Response) => {
  try {
    const students = await Student.find();
    res.status(200).json(students);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
