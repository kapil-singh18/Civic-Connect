import mongoose from 'mongoose';

export const categories = [
  'Road Damage',
  'Potholes',
  'Garbage Collection',
  'Street Light',
  'Drainage',
  'Water Leakage',
  'Traffic Signal',
  'Public Safety',
  'Other'
];

const progressSchema = new mongoose.Schema(
  {
    step: {
      type: String,
      enum: ['Report Submitted', 'Acknowledged', 'Assigned', 'Work Started', 'Work Completed', 'Resolved'],
      required: true
    },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    comments: { type: String, default: '' }
  },
  { timestamps: true }
);

const replySchema = new mongoose.Schema(
  {
    message: { type: String, required: true, trim: true, maxlength: 1200 },
    sentBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
  },
  { timestamps: true }
);

const issueSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 140 },
    description: { type: String, required: true, trim: true, maxlength: 2000 },
    category: { type: String, enum: categories, required: true },
    priority: { type: String, enum: ['Low', 'Medium', 'High', 'Critical'], default: 'Medium' },
    status: { type: String, enum: ['Pending', 'Acknowledged', 'Assigned', 'In Progress', 'Resolved'], default: 'Pending' },
    imageUrl: { type: String, default: '' },
    location: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
      address: { type: String, required: true, trim: true }
    },
    reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    assignedDepartment: { type: String, default: 'General Civic Response' },
    progress: [progressSchema],
    replies: [replySchema],
    adminNotes: { type: String, default: '' }
  },
  { timestamps: true }
);

export default mongoose.model('Issue', issueSchema);
