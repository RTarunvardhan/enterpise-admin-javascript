/**
 * EMPLOYEE DATASET
 * -----------------------------------
 * INPUT: None
 * OUTPUT: Array (100–500 rows)
 *
 * PURPOSE:
 *  Used for tables, dashboards, analytics
 */

/**
 * DATA: EMPLOYEES
 * PURPOSE: Centralized mock database with 35 columns and 200 rows.
 */
const firstNames = [
  "Arjun", "Amit", "Ravi", "Kiran", "Suresh", "Vikram", "Rahul", "Rohan", "Ankit", "Manoj",
  "Deepak", "Naveen", "Ajay", "Karthik", "Sanjay", "Pradeep", "Varun", "Abhishek", "Nikhil", "Harish",
  "Anil", "Rajesh", "Sunil", "Mahesh", "Vivek", "Gopal", "Tarun", "Shyam", "Lokesh", "Naresh",
  "Saritha", "Priya", "Anjali", "Meera", "Lakshmi", "Pooja", "Sneha", "Kavya", "Swathi", "Divya",
  "Aishwarya", "Neha", "Ritu", "Shilpa", "Bhavana", "Keerthi", "Nisha", "Rashmi", "Sowmya", "Preeti"
];

const lastNames = [
  "Reddy", "Sharma", "Verma", "Nair", "Patel", "Goud", "Kapoor", "Singh", "Das", "Choudhury",
  "Agarwal", "Mehta", "Iyer", "Pillai", "Yadav", "Bansal", "Mishra", "Saxena", "Joshi", "Kulkarni",
  "Pandey", "Dubey", "Tiwari", "Rathore", "Chauhan", "Sinha", "Malhotra", "Bhat", "Shetty", "Naidu",
  "Menon", "Khan", "Ali", "Ansari", "Fernandes", "D'Souza", "Thomas", "Mathew", "George", "Paul",
  "Rao", "Gupta", "Jain", "Chopra", "Arora", "Bose", "Roy", "Banerjee", "Sen", "Mukherjee"
];
const depts = ["IT Services", "Human Resources", "Digital Marketing", "Financial Operations", "Product Management"];
const roles = ["Senior Developer", "Junior Developer", "HR Specialist", "Business Analyst", "QA Engineer", "Project Lead", "UX Designer"];

export const EMPLOYEES = Array.from({ length: 200 }, (_, i) => {
  const fIndex = i % firstNames.length;

  const lIndex =
    (i + Math.floor(i / firstNames.length)) % lastNames.length;

  const fName = firstNames[fIndex];
  const lName = lastNames[lIndex];
  return {
    id: i + 1,
    firstName: fName,
    lastName: lName,
    fullName: `${fName} ${lName}`,
    email: `${fName.toLowerCase()}.${lName.toLowerCase()}${i}@dmart.com`,
    phone: `+91 98480 ${20000 + i}`,
    department: depts[i % 5],
    designation: roles[i % 7],
    salary: 45000 + (i * 250),
    annualBonus: 5000 + (i * 50),
    joiningDate: `202${i % 4 + 1}-0${(i % 9) + 1}-15`,
    experienceYears: (i % 12) + 1,
    performanceScore: Math.floor(Math.random() * 40) + 60, // 60-100
    rating: (Math.random() * 2 + 3).toFixed(1), // 3.0 - 5.0
    status: i % 15 === 0 ? "On Leave" : "Active",
    officeLocation: i % 2 === 0 ? "Building A, Hitech City" : "Building B, Gachibowli",
    city: "Hyderabad",
    state: "Telangana",
    country: "India",
    managerName: `Manager ${Math.floor(i / 10) + 1}`,
    lastPromotionDate: "2024-12-25",
    projectsAssigned: (i % 5) + 1,
    projectsCompleted: (i % 4) + 1,
    attendance: 85 + (i % 15),
    emergencyContact: `99887 ${70000 + i}`,
    bankName: "HDFC Bank",
    accountNumber: `50100${123456 + i}`,
    panCard: `ABCDE${1000 + i}F`,
    bloodGroup: ["A+", "B+", "O+", "AB+"][i % 4],
    dateOfBirth: `199${i % 9}-05-20`,
    gender: i % 3 === 0 ? "Female" : "Male",
    education: "B.Tech Computer Science",
    skypeId: `live:emp_${i}`,
    linkedinUrl: `linkedin.com/in/emp${i}`,
    contractType: "Full-Time"
  };
});