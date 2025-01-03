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

// * GET SINGLE STUDENT'S COMPANY HISTORY
export const getStudentCompanyHistory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { control_number } = req.params;
    const student = await Student.findOne({ control_number: control_number });

    if (!student) {
      res.status(404).json({ error: 'Estudiante no encontrado' });
      return;
    }

    res.status(200).json(student.companyHistory);
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

// * DELETE A STUDENT by CONTROL NUMBER
export const deleteStudent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { control_number } = req.params;
    await Student.findOneAndDelete({ control_number });
    res.status(200).json({ message: 'Estudiante eliminado' });
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

    res.status(200).json(updatedStudent);
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

// * ADD TO COMPANY HISTORY
export const addCompanyToHistory = async (req: Request, res: Response): Promise<void> => {
  const { control_number } = req.params;
  const newCompany = req.body;

  try {
    const updatedStudent = await Student.findOneAndUpdate(
      { control_number },
      { $push: { companyHistory: newCompany } },
      { new: true, runValidators: true }
    );

    if (!updatedStudent) {
      res.status(404).json({ error: 'Estudiante no encontrado' });
      return;
    }

    res.status(200).json(updatedStudent);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// * EDIT COMPANY IN HISTORY
export const editCompanyInHistory = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { control_number } = req.params;
  const { companyIndex, updatedCompany } = req.body;

  try {
    const student = await Student.findOne({ control_number });

    if (!student) {
      res.status(404).json({ error: 'Estudiante no encontrado' });
      return;
    }

    if (!student.companyHistory[companyIndex]) {
      res.status(400).json({ error: 'Índice de empresa inválido' });
      return;
    }

    student.companyHistory[companyIndex] = {
      ...student.companyHistory[companyIndex],
      ...updatedCompany,
    };

    await student.save();

    res.status(200).json(student);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// * DELETE COMPANY FROM HISTORY
export const deleteCompanyFromHistory = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { control_number } = req.params;
  const { companyIndex } = req.body;

  try {
    const student = await Student.findOne({ control_number });

    if (!student) {
      res.status(404).json({ error: 'Estudiante no encontrado' });
      return;
    }

    if (companyIndex < 0 || companyIndex >= student.companyHistory.length) {
      res.status(400).json({ error: 'Índice de empresa inválido' });
      return;
    }

    student.companyHistory.splice(companyIndex, 1);

    await student.save();

    res.status(200).json(student);
  } catch (error: any) {
    console.error(error);
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

    const totalStudents = await Student.countDocuments();

    if (totalStudents === 0) {
      res.status(404).json({ message: 'No students found.' });
    }


    const pipeline: any[] = [
      {
        $group: {
          _id: '$company.location.state',
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
      {
        $project: {
          city: '$_id',
          count: 1,
          percentage: {
            $round: [{ $multiply: [{ $divide: ['$count', totalStudents] }, 100] }, 2], 
          },
        },
      },
    ];

    const students = await Student.aggregate(pipeline);

    res.status(200).json(students);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getStudentsByActivity = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const students = await Student.aggregate([
      {
        $facet: {
          working: [
            {
              $match: {
                'activity.activities': {
                  $elemMatch: { $in: ['trabaja', 'estudia y trabaja'] },
                },
              },
            },
            { $count: 'count' },
          ],
          notWorking: [
            {
              $match: {
                'activity.activities': {
                  $elemMatch: { $in: ['no trabaja'] },
                },
              },
            },
            { $count: 'count' },
          ],
          studying: [
            {
              $match: {
                'activity.activities': {
                  $elemMatch: { $in: ['estudia', 'estudia y trabaja'] },
                },
              },
            },
            { $count: 'count' },
          ],
          notStudying: [
            {
              $match: {
                'activity.activities': {
                  $elemMatch: { $in: ['no trabaja', 'no estudia ni trabaja'] },
                },
              },
            },
            { $count: 'count' },
          ],
        },
      },
      {
        $project: {
          working: { $arrayElemAt: ['$working.count', 0] },
          notWorking: { $arrayElemAt: ['$notWorking.count', 0] },
          studying: { $arrayElemAt: ['$studying.count', 0] },
          notStudying: { $arrayElemAt: ['$notStudying.count', 0] },
        },
      },
    ]);

    // Calcular el total de estudiantes
    const totalStudents =
      students[0].working +
      students[0].notWorking +
      students[0].studying +
      students[0].notStudying;

    // Agregar los porcentajes
    const response = {
      working: {
        count: students[0].working || 0,
        percentage: totalStudents
          ? ((students[0].working / totalStudents) * 100).toFixed(2)
          : '0',
      },
      notWorking: {
        count: students[0].notWorking || 0,
        percentage: totalStudents
          ? ((students[0].notWorking / totalStudents) * 100).toFixed(2)
          : '0',
      },
      studying: {
        count: students[0].studying || 0,
        percentage: totalStudents
          ? ((students[0].studying / totalStudents) * 100).toFixed(2)
          : '0',
      },
      notStudying: {
        count: students[0].notStudying || 0,
        percentage: totalStudents
          ? ((students[0].notStudying / totalStudents) * 100).toFixed(2)
          : '0',
      },
    };

    res.status(200).json(response);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
