import dotenv from 'dotenv';
import { connectDb } from '../config/db.js';
import Issue from '../models/Issue.js';
import Notification from '../models/Notification.js';
import User from '../models/User.js';
import { assignDepartment, calculatePriority } from './routing.js';

dotenv.config();

async function seed() {
  await connectDb();
  await Promise.all([User.deleteMany({}), Issue.deleteMany({}), Notification.deleteMany({})]);

  const [citizen, admin] = await User.create([
    {
      name: 'Asha Verma',
      email: 'citizen@civicconnect.gov',
      phone: '9876543210',
      password: 'Password123!',
      role: 'citizen',
      city: 'Bhopal',
      area: 'MP Nagar',
      points: 40,
      reportsSubmitted: 4
    },
    {
      name: 'Municipal Admin',
      email: 'admin@civicconnect.gov',
      phone: '9000000000',
      password: 'Password123!',
      role: 'admin',
      city: 'Bhopal',
      area: 'Municipal Control Room'
    }
  ]);

  const demoIssues = [
    ['Large pothole near school crossing', 'Deep pothole causing traffic slowdown and risk to students.', 'Potholes', 'MP Nagar Zone 1, Bhopal', 23.2337, 77.4299],
    ['Street light not working', 'Street light has been off for four nights near the bus stop.', 'Street Light', 'New Market, Bhopal', 23.2358, 77.4009],
    ['Water leakage on service road', 'Continuous water leakage creating slippery conditions.', 'Water Leakage', 'Arera Colony, Bhopal', 23.2097, 77.4348],
    ['Garbage dump overflowing', 'Garbage has not been collected for three days.', 'Garbage Collection', 'Kolar Road, Bhopal', 23.1674, 77.4178]
  ];

  for (const [title, description, category, address, latitude, longitude] of demoIssues) {
    await Issue.create({
      title,
      description,
      category,
      priority: calculatePriority(category),
      status: category === 'Garbage Collection' ? 'Resolved' : 'Pending',
      imageUrl: '',
      location: { latitude, longitude, address },
      reportedBy: citizen._id,
      assignedDepartment: assignDepartment(category),
      progress: [{ step: 'Report Submitted', updatedBy: citizen._id, comments: 'Seed report created.' }]
    });
  }

  await Notification.create({
    userId: admin._id,
    title: 'Demo Reports Ready',
    message: 'Four demo civic reports from Bhopal are ready for review.',
    type: 'new_report',
    senderId: citizen._id
  });
  console.log('Seeded Civic Connect demo data');
  process.exit(0);
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
