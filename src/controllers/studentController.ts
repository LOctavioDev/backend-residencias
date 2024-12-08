import { Request, Response } from 'express';
import Student from '../models/Student';

// * CREATE A NEW STUDENT

export const createStudent = async (req: Request, res: Response) => {
  try {
    const student = new Student(req.body);

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

// * GET STUDENT BY CONTROL NUMBER
export const getStudentsByControlNumber = async (
  req: Request,
  res: Response
): Promise<void> => {
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

// * DELETE ALL STUDENTS
export const deleteAllStudents = async (req: Request, res: Response): Promise<void> => {
  try {
    await Student.deleteMany({}); 
    res.status(200).json({ message: 'Todos los estudiantes han sido eliminados.' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// * UPDATE A STUDENT BY CONTROL NUMBER
export const updateStudent = async (req: Request, res: Response): Promise<void> => {
  const { control_number } = req.params; 
  const updatedData = req.body; 

  try {
    const updatedStudent = await Student.findOneAndUpdate(
      { control_number }, 
      updatedData,
      {
        new: true, 
        runValidators: true, 
      }
    );

    if (!updatedStudent) {
      res.status(404).json({ error: 'Estudiante no encontrado' });
      return;
    }

    // Devolver el estudiante actualizado
    res.status(200).json(updatedStudent);
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

// * GRAFICAS

// * GET NUMBER OF STUDENTS BY GENERATION
export const getStudentsByGeneration = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const students = await Student.aggregate([
      {
        $addFields: {
          endYear: {
            $year: { $toDate: { $multiply: ['$generation.endDate', 1000] } }, 
          },
        },
      },
      {
        $group: {
          _id: { year: '$endYear' }, 
          count: { $sum: 1 },
        },
      },
      {
        $sort: { '_id.year': 1 }, 
      },
    ]);

    res.status(200).json(students);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};



export const getJobTypeData = async (req: Request, res: Response): Promise<void> => {
  try {
    const jobTypeCounts = await Student.aggregate([
      {
        $group: {
          _id: '$sector',
          count: { $sum: 1 },
        },
      },
    ]);

    const chartData = jobTypeCounts.map((item) => ({
      jobType: item._id || 'Sin especificar',
      count: item.count,
    }));

    res.json(chartData);
  } catch (error) {
    console.error('Error fetching job type data:', error);
    res.status(500).json({ error: 'Error fetching job type data' });
  }
};

// * GET NUMBER OF STUDENTS BY CITY
export const getStudentsByCity = async (req: Request, res: Response): Promise<void> => {
  try {
    const students = await Student.aggregate([
      {
        $group: {
          _id: '$company.location.state',
          count: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json(students);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
