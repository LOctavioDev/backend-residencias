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
  company: {
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
  updatedAt: string;
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
  company: {
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
  updatedAt: { type: String, required: true },
});

const Student = mongoose.model<IStudent>('Student', StudentSchema);

export default Student;
