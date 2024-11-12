import mongoose, { Schema, Document } from 'mongoose';

// ! DEFINE THE INTERFACE FOR THE STUDENT DPCUMENT

interface IStudent extends Document {
  control_number: string;
  name: {
    first: string;
    last: string;
    middle?: string;
  };
  generation: {
    start: {
      year: number;
      semester: string;
    };

    end: {
      year: number;
      semester: string;
    };
  };
  activity: string[];
  company: {
    name: string;
    location: {
      city: string;
      municipality: string;
      state: string;
    };

    postion: string;
    years_in_position: number;
    job_type: string;
  };

  employment_status: {
    type: string[];
  };
  sector: {
    category: string;
    type: string;
  };
  participation: string;
  contact_source: string;
}

// ! CREATE THE SHCEMA BASED ON THE INTERFACE

const StudentSchema: Schema = new Schema({
  control_number: { type: String, required: true, unique: true },
  name: {
    first: { type: String, required: true },
    last: { type: String, required: true },
    middle: String,
  },
  generation: {
    start: {
      year: { type: Number, required: true },
      semester: { type: String, required: true },
    },
    end: {
      year: { type: Number, required: true },
      semester: { type: String, required: true },
    },
  },
  activity: {
    activities: { type: [String], required: true }, // Corrige aquí
  },
  company: {
    name: { type: String, required: true },
    location: {
      city: { type: String, required: true },
      municipality: { type: String, required: true },
      state: { type: String, required: true },
    },
    position: { type: String, required: true },
    years_in_position: { type: Number, required: true },
    job_type: { type: String, required: true },
  },
  employment_status: {
    type: { type: [String], required: true }, // Corrige aquí
  },
  sector: {
    category: { type: String, required: true },
    type: { type: String, required: true },
  },
  participation: { type: String, required: true },
  contact_source: { type: String, required: true },
});

const Student = mongoose.model<IStudent>('Student', StudentSchema);

export default Student;
