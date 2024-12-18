import mongoose, { Schema, Document } from 'mongoose';

// ! DEFINE THE INTERFACE FOR THE STUDENT DOCUMENT
interface IStudent extends Document {
  control_number: string;
  career: string;
  name: {
    first: string;
    last: string;
    middle?: string;
  };
  generation: {
    startDate: number;
    endDate: number;
  };
  email: string;
  discharge_date: number;
  activity: string[];
  birthdate: number;
  curp: string;
  marital_status: string;
  gender: string;
  home_address: string;
  cp: string;
  student_city: string;
  student_municipality: string;
  student_state: string;
  phone: string;
  certificate: string;
  graduation_date: number;
  graduation_option: string;
  post_graduation: string;
  company: {
    boss_name: string;
    boss_position: string;
    company_address: string;
    company_cp: string;
    company_phone: string;
    fax: string;
    company_email: string;
    salary: string;
    name: string;
    location: {
      city: string;
      municipality: string;
      state: string;
    };
    position: string;
    years_in_position: number;
    hierarchical_level: string;
    startDate: number;
    endDate: number;
  };
  companyHistory: [
    {
      name: string;
      startDate: number;
      endDate: number;
    }
  ];
  working_condition: {
    type: string;
  };
  sector: string;
  institution: string;
  profile: string;
  contact_source: string;
  studentAt: string;
  updatedAt: Date;
}

// ! CREATE THE SCHEMA BASED ON THE INTERFACE

const StudentSchema: Schema = new Schema({
  control_number: { type: String, required: true, unique: true },
  career: { type: String, required: true },
  name: {
    first: { type: String, required: true },
    last: { type: String, required: true },
    middle: String,
  },
  generation: {
    startDate: { type: Number, required: true },
    endDate: { type: Number, required: true },
  },
  email: { type: String, required: true, unique: true },
  discharge_date: { type: Number, required: false },
  activity: {
    activities: { type: [String], required: true },
  },
  birthdate: { type: Number, required: true },
  curp: { type: String, required: true, unique: true },
  marital_status: { type: String, required: true },
  gender: { type: String, required: true },
  home_address: { type: String, required: true },
  cp: { type: String, required: true },
  student_city: { type: String, required: true },
  student_municipality: { type: String, required: true },
  student_state: { type: String, required: true },
  phone: { type: String, required: true },
  certificate: { type: String, required: true },
  graduation_date: { type: Number, required: true },
  graduation_option: { type: String, required: true },
  post_graduation: { type: String, required: true },
  company: {
    boss_name: { type: String, required: true },
    boss_position: { type: String, required: true },
    company_address: { type: String, required: true },
    company_cp: { type: String, required: true },
    company_phone: { type: String, required: true },
    fax: { type: String, required: false },
    company_email: { type: String, required: true },
    salary: { type: String, required: true },
    name: { type: String, required: true },
    location: {
      city: { type: String, required: true },
      municipality: { type: String, required: true },
      state: { type: String, required: true },
    },
    position: { type: String, required: true },
    years_in_position: { type: Number, required: false },
    hierarchical_level: { type: String, required: true },
    startDateC: { type: Number, required: false },
    endDateC: { type: Number, required: false },
  },
  companyHistory: [
    {
      name: { type: String, required: false },
      startDateH: { type: Number, required: false },
      endDateH: { type: Number, required: false },
    },
  ],
  working_condition: {
    type: { type: String, required: true },
  },
  sector: { type: String, required: true },
  institution: { type: String, required: true },
  profile: { type: String, required: true },
  contact_source: { type: String, required: true },
  studentAt: { type: String, required: true },
  updatedAt: { type: Date, required: true },
});

const Student = mongoose.model<IStudent>('Student', StudentSchema);

export default Student;
