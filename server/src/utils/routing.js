const highPriorityCategories = new Set(['Public Safety', 'Water Leakage', 'Road Damage']);

const departmentByCategory = {
  'Road Damage': 'Public Works Department',
  Potholes: 'Public Works Department',
  'Garbage Collection': 'Sanitation Department',
  'Street Light': 'Electrical Department',
  Drainage: 'Sewer Department',
  'Water Leakage': 'Water Department',
  'Traffic Signal': 'Traffic Management Department',
  'Public Safety': 'Public Safety Department',
  Other: 'General Civic Response'
};

export function calculatePriority(category, requestedPriority = 'Medium') {
  if (highPriorityCategories.has(category)) return 'High';
  return requestedPriority;
}

export function assignDepartment(category) {
  return departmentByCategory[category] || departmentByCategory.Other;
}
