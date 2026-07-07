// ============================================================
// SPMS Mock Data — src/data/mockData.js
// Mirrors the SQL schema exactly. Swap VITE_USE_MOCK=false to
// use real API — zero component changes required.
// ============================================================

// ── Roles ─────────────────────────────────────────────────
export const mockRoles = [
  { RoleId: 1, RoleName: 'Admin',   Description: 'Full system access and configuration' },
  { RoleId: 2, RoleName: 'Faculty', Description: 'Supervises projects and reviews tasks' },
  { RoleId: 3, RoleName: 'Student', Description: 'Works on assigned projects and tasks' },
];

// ── Statuses ───────────────────────────────────────────────
export const mockStatuses = [
  { StatusID: 1, StatusName: 'Pending',     StatusCssClass: 'status-pending' },
  { StatusID: 2, StatusName: 'In Progress', StatusCssClass: 'status-inprogress' },
  { StatusID: 3, StatusName: 'Completed',   StatusCssClass: 'status-completed' },
  { StatusID: 4, StatusName: 'Rejected',    StatusCssClass: 'status-rejected' },
  { StatusID: 5, StatusName: 'On Hold',     StatusCssClass: 'status-onhold' },
];

// ── Priorities ─────────────────────────────────────────────
export const mockPriorities = [
  { PriorityID: 1, PriorityName: 'High',   PriortyCssClass: 'priority-high' },
  { PriorityID: 2, PriorityName: 'Medium', PriortyCssClass: 'priority-medium' },
  { PriorityID: 3, PriorityName: 'Low',    PriortyCssClass: 'priority-low' },
];

// ── Users ──────────────────────────────────────────────────
export const mockUsers = [
  {
    UserId: 1, FullName: 'Rohit Agrawal', Email: 'admin@spms.edu',
    Password: 'hashed', MobileNumber: '9876543210',
    ProfilePicturePath: null, IsActive: true, IsDeleted: false,
  },
  {
    UserId: 2, FullName: 'Dr. Raj Tanna', Email: 'rajtanna@spms.edu',
    Password: 'hashed', MobileNumber: '9123456780',
    ProfilePicturePath: null, IsActive: true, IsDeleted: false,
  },
  {
    UserId: 3, FullName: 'Prof. Jasmin Patel', Email: 'jasminkpt@spms.edu',
    Password: 'hashed', MobileNumber: '9023456781',
    ProfilePicturePath: null, IsActive: true, IsDeleted: false,
  },
  {
    UserId: 4, FullName: 'Dr. Dhruv Dave', Email: 'dhruvdave@spms.edu',
    Password: 'hashed', MobileNumber: '9034567890',
    ProfilePicturePath: null, IsActive: true, IsDeleted: false,
  },
  {
    UserId: 5, FullName: 'Aarav Patel', Email: 'aarav@student.spms.edu',
    Password: 'hashed', MobileNumber: '8123456789',
    ProfilePicturePath: null, IsActive: true, IsDeleted: false,
  },
  {
    UserId: 6, FullName: 'Priya Sharma', Email: 'psharma@student.spms.edu',
    Password: 'hashed', MobileNumber: '8234567890',
    ProfilePicturePath: null, IsActive: true, IsDeleted: false,
  },
  {
    UserId: 7, FullName: 'Tanishq Pandya', Email: 'tpandya@student.spms.edu',
    Password: 'hashed', MobileNumber: '8345678901',
    ProfilePicturePath: null, IsActive: true, IsDeleted: false,
  },
  {
    UserId: 8, FullName: 'Yuvraj Jadeja', Email: 'yj@student.spms.edu',
    Password: 'hashed', MobileNumber: '8456789012',
    ProfilePicturePath: null, IsActive: true, IsDeleted: false,
  },
  {
    UserId: 9, FullName: 'Nandani Dave', Email: 'davend@student.spms.edu',
    Password: 'hashed', MobileNumber: '8567890123',
    ProfilePicturePath: null, IsActive: true, IsDeleted: false,
  },
  {
    UserId: 10, FullName: 'Anika Singh', Email: 'asingh@student.spms.edu',
    Password: 'hashed', MobileNumber: '8678901234',
    ProfilePicturePath: null, IsActive: false, IsDeleted: false,
  },
];

// ── UserRoles ──────────────────────────────────────────────
export const mockUserRoles = [
  { RolePermissionId: 1, RoleId: 1, UserId: 1 },  // Rohit → Admin
  { RolePermissionId: 2, RoleId: 2, UserId: 2 },  // Raj → Faculty
  { RolePermissionId: 3, RoleId: 2, UserId: 3 },  // Jasmin → Faculty
  { RolePermissionId: 4, RoleId: 2, UserId: 4 },  // Dhruv → Faculty
  { RolePermissionId: 5, RoleId: 3, UserId: 5 },  // Aarav → Student
  { RolePermissionId: 6, RoleId: 3, UserId: 6 },  // Priya → Student
  { RolePermissionId: 7, RoleId: 3, UserId: 7 },  // Tanishq → Student
  { RolePermissionId: 8, RoleId: 3, UserId: 8 },  // Yuvraj → Student
  { RolePermissionId: 9, RoleId: 3, UserId: 9 },  // Nandani → Student
  { RolePermissionId: 10, RoleId: 3, UserId: 10 }, // Anika → Student
];

// ── Projects ───────────────────────────────────────────────
export const mockProjects = [
  {
    ProjectId: 1, ProjectTitle: 'AI-Powered Crop Disease Detection',
    Description: 'Deep learning model to identify crop diseases from leaf imagery using CNNs and transfer learning.',
    StudentId: 5, FacultyId: 2, AssignedDate: '2025-01-10', IsDeleted: false,
    ProjectStatus: 2, StartDate: '2025-01-15', EndDate: '2025-06-30',
    TotalTasks: 8, CompletedTasks: 5, ProgressPercentage: 62,
  },
  {
    ProjectId: 2, ProjectTitle: 'Real-Time Sign Language Translator',
    Description: 'Computer vision system that translates ASL gestures into text and speech in real-time.',
    StudentId: 6, FacultyId: 2, AssignedDate: '2025-02-01', IsDeleted: false,
    ProjectStatus: 2, StartDate: '2025-02-05', EndDate: '2025-07-15',
    TotalTasks: 6, CompletedTasks: 3, ProgressPercentage: 50,
  },
  {
    ProjectId: 3, ProjectTitle: 'Blockchain-Based Academic Credential System',
    Description: 'Immutable ledger for storing and verifying academic certificates using Ethereum smart contracts.',
    StudentId: 7, FacultyId: 3, AssignedDate: '2025-01-20', IsDeleted: false,
    ProjectStatus: 3, StartDate: '2025-01-25', EndDate: '2025-05-31',
    TotalTasks: 7, CompletedTasks: 7, ProgressPercentage: 100,
  },
  {
    ProjectId: 4, ProjectTitle: 'Smart Campus Energy Management',
    Description: 'IoT-based system monitoring energy consumption across campus buildings with ML anomaly detection.',
    StudentId: 8, FacultyId: 3, AssignedDate: '2025-03-01', IsDeleted: false,
    ProjectStatus: 1, StartDate: '2025-03-10', EndDate: '2025-08-20',
    TotalTasks: 5, CompletedTasks: 0, ProgressPercentage: 0,
  },
  {
    ProjectId: 5, ProjectTitle: 'Mental Health Chatbot with NLP',
    Description: 'Empathetic conversational agent for student mental health support using transformer models.',
    StudentId: 9, FacultyId: 4, AssignedDate: '2025-02-15', IsDeleted: false,
    ProjectStatus: 2, StartDate: '2025-02-20', EndDate: '2025-07-30',
    TotalTasks: 9, CompletedTasks: 4, ProgressPercentage: 44,
  },
  {
    ProjectId: 6, ProjectTitle: 'Autonomous Drone Navigation System',
    Description: 'SLAM-based navigation for indoor drones using LiDAR and depth cameras.',
    StudentId: 10, FacultyId: 4, AssignedDate: '2025-01-05', IsDeleted: false,
    ProjectStatus: 4, StartDate: '2025-01-10', EndDate: '2025-04-30',
    TotalTasks: 6, CompletedTasks: 2, ProgressPercentage: 33,
  },
  {
    ProjectId: 7, ProjectTitle: 'Federated Learning for Healthcare Privacy',
    Description: 'Privacy-preserving ML framework allowing hospitals to train shared models without data sharing.',
    StudentId: 5, FacultyId: 2, AssignedDate: '2025-04-01', IsDeleted: false,
    ProjectStatus: 1, StartDate: '2025-04-10', EndDate: '2025-09-30',
    TotalTasks: 4, CompletedTasks: 0, ProgressPercentage: 0,
  },
  {
    ProjectId: 8, ProjectTitle: 'Quantum-Inspired Optimization Algorithms',
    Description: 'Classical simulation of quantum annealing for combinatorial optimization problems.',
    StudentId: 6, FacultyId: 3, AssignedDate: '2025-03-15', IsDeleted: false,
    ProjectStatus: 2, StartDate: '2025-03-20', EndDate: '2025-08-15',
    TotalTasks: 5, CompletedTasks: 2, ProgressPercentage: 40,
  },
];

// ── Tasks ──────────────────────────────────────────────────
export const mockTasks = [
  // Project 1 — AI Crop Disease
  {
    TaskId: 1, AllocationID: 1, TaskTitle: 'Dataset Collection & Preprocessing',
    TaskDescription: 'Collect PlantVillage dataset, perform augmentation, normalization, and train/val/test splits.',
    TaskStatus: 3, PriorityID: 1, AssignedScore: 20, EarnedScore: 20,
    ProgressPercentage: 100, StartDate: '2025-01-15', DueDate: '2025-02-01',
    CompletedDate: '2025-01-30', FacultyRemarks: 'Excellent preprocessing pipeline.', StudentRemarks: 'Used albumentations for augmentation.', IsDeleted: false,
  },
  {
    TaskId: 2, AllocationID: 1, TaskTitle: 'CNN Model Architecture Design',
    TaskDescription: 'Design and implement a ResNet-50 based transfer learning model with custom classification head.',
    TaskStatus: 3, PriorityID: 1, AssignedScore: 25, EarnedScore: 23,
    ProgressPercentage: 100, StartDate: '2025-02-01', DueDate: '2025-02-28',
    CompletedDate: '2025-02-25', FacultyRemarks: 'Good model design, minor issues with dropout placement.', StudentRemarks: 'Tried EfficientNet as well.', IsDeleted: false,
  },
  {
    TaskId: 3, AllocationID: 1, TaskTitle: 'Model Training & Hyperparameter Tuning',
    TaskDescription: 'Train model on GPU, perform grid search for learning rate, batch size, and regularization.',
    TaskStatus: 3, PriorityID: 1, AssignedScore: 20, EarnedScore: 18,
    ProgressPercentage: 100, StartDate: '2025-03-01', DueDate: '2025-03-31',
    CompletedDate: '2025-03-28', FacultyRemarks: 'Acceptable accuracy. Could improve val loss.', StudentRemarks: 'Achieved 94.2% validation accuracy.', IsDeleted: false,
  },
  {
    TaskId: 4, AllocationID: 1, TaskTitle: 'Model Evaluation & Metrics Dashboard',
    TaskDescription: 'Generate confusion matrix, ROC curves, and build a Streamlit dashboard for visualization.',
    TaskStatus: 3, PriorityID: 2, AssignedScore: 15, EarnedScore: 15,
    ProgressPercentage: 100, StartDate: '2025-04-01', DueDate: '2025-04-20',
    CompletedDate: '2025-04-18', FacultyRemarks: 'Dashboard is clean and informative.', StudentRemarks: 'Added Grad-CAM visualizations.', IsDeleted: false,
  },
  {
    TaskId: 5, AllocationID: 1, TaskTitle: 'REST API Deployment',
    TaskDescription: 'Package model with FastAPI, containerize with Docker, deploy to AWS EC2.',
    TaskStatus: 3, PriorityID: 1, AssignedScore: 20, EarnedScore: 19,
    ProgressPercentage: 100, StartDate: '2025-04-20', DueDate: '2025-05-15',
    CompletedDate: '2025-05-12', FacultyRemarks: 'API works well. Add rate limiting.', StudentRemarks: 'Added health checks and logging.', IsDeleted: false,
  },
  {
    TaskId: 6, AllocationID: 1, TaskTitle: 'Mobile App Frontend Integration',
    TaskDescription: 'Build React Native app that interfaces with the deployed API for field use.',
    TaskStatus: 2, PriorityID: 2, AssignedScore: 20, EarnedScore: 0,
    ProgressPercentage: 65, StartDate: '2025-05-15', DueDate: '2025-06-20',
    CompletedDate: null, FacultyRemarks: '', StudentRemarks: 'Camera integration done. Working on result display.', IsDeleted: false,
  },
  {
    TaskId: 7, AllocationID: 1, TaskTitle: 'Final Report & Documentation',
    TaskDescription: 'Write comprehensive project report including methodology, results, and future work.',
    TaskStatus: 1, PriorityID: 2, AssignedScore: 10, EarnedScore: 0,
    ProgressPercentage: 10, StartDate: '2025-06-01', DueDate: '2025-06-28',
    CompletedDate: null, FacultyRemarks: '', StudentRemarks: 'Started literature review section.', IsDeleted: false,
  },
  // Project 2 — Sign Language
  {
    TaskId: 8, AllocationID: 2, TaskTitle: 'ASL Dataset Acquisition & Annotation',
    TaskDescription: 'Collect ASL gesture videos, annotate with MediaPipe hand landmarks.',
    TaskStatus: 3, PriorityID: 1, AssignedScore: 20, EarnedScore: 20,
    ProgressPercentage: 100, StartDate: '2025-02-05', DueDate: '2025-02-28',
    CompletedDate: '2025-02-25', FacultyRemarks: 'Good annotation quality.', StudentRemarks: 'Used 5 volunteers for recording.', IsDeleted: false,
  },
  {
    TaskId: 9, AllocationID: 2, TaskTitle: 'LSTM Gesture Recognition Model',
    TaskDescription: 'Build sequence model on landmark time-series data for 26-letter ASL classification.',
    TaskStatus: 3, PriorityID: 1, AssignedScore: 30, EarnedScore: 27,
    ProgressPercentage: 100, StartDate: '2025-03-01', DueDate: '2025-04-15',
    CompletedDate: '2025-04-10', FacultyRemarks: 'Strong model. 91% accuracy is impressive.', StudentRemarks: 'Also tested GRU, LSTM performed better.', IsDeleted: false,
  },
  {
    TaskId: 10, AllocationID: 2, TaskTitle: 'Real-time Webcam Pipeline',
    TaskDescription: 'Integrate model with OpenCV for real-time inference on webcam feed.',
    TaskStatus: 3, PriorityID: 1, AssignedScore: 25, EarnedScore: 22,
    ProgressPercentage: 100, StartDate: '2025-04-15', DueDate: '2025-05-10',
    CompletedDate: '2025-05-08', FacultyRemarks: 'Latency is acceptable. Polish UI.', StudentRemarks: 'Running at 24fps on CPU.', IsDeleted: false,
  },
  {
    TaskId: 11, AllocationID: 2, TaskTitle: 'Text-to-Speech Integration',
    TaskDescription: 'Connect recognized text output to a TTS engine for audio output.',
    TaskStatus: 2, PriorityID: 2, AssignedScore: 15, EarnedScore: 0,
    ProgressPercentage: 40, StartDate: '2025-05-10', DueDate: '2025-06-15',
    CompletedDate: null, FacultyRemarks: '', StudentRemarks: 'Using gTTS, exploring pyttsx3 for offline use.', IsDeleted: false,
  },
  {
    TaskId: 12, AllocationID: 2, TaskTitle: 'User Testing & Feedback Report',
    TaskDescription: 'Conduct usability study with 10 participants, analyze feedback and iterate.',
    TaskStatus: 1, PriorityID: 3, AssignedScore: 10, EarnedScore: 0,
    ProgressPercentage: 0, StartDate: '2025-06-15', DueDate: '2025-07-10',
    CompletedDate: null, FacultyRemarks: '', StudentRemarks: '', IsDeleted: false,
  },
  // Project 3 — Blockchain (Completed)
  {
    TaskId: 13, AllocationID: 3, TaskTitle: 'Smart Contract Development',
    TaskDescription: 'Write Solidity contracts for credential issuance, verification, and revocation.',
    TaskStatus: 3, PriorityID: 1, AssignedScore: 30, EarnedScore: 30,
    ProgressPercentage: 100, StartDate: '2025-01-25', DueDate: '2025-02-28',
    CompletedDate: '2025-02-20', FacultyRemarks: 'Excellent contract design with proper access controls.', StudentRemarks: 'All unit tests passing.', IsDeleted: false,
  },
  {
    TaskId: 14, AllocationID: 3, TaskTitle: 'IPFS Integration for Document Storage',
    TaskDescription: 'Store certificate PDFs on IPFS and reference CID in smart contract.',
    TaskStatus: 3, PriorityID: 1, AssignedScore: 20, EarnedScore: 20,
    ProgressPercentage: 100, StartDate: '2025-03-01', DueDate: '2025-03-25',
    CompletedDate: '2025-03-22', FacultyRemarks: 'Clean implementation.', StudentRemarks: 'Using Pinata for IPFS pinning.', IsDeleted: false,
  },
  {
    TaskId: 15, AllocationID: 3, TaskTitle: 'Verification Portal UI',
    TaskDescription: 'Build a public-facing web portal for employers to verify credentials by entering a certificate ID.',
    TaskStatus: 3, PriorityID: 2, AssignedScore: 20, EarnedScore: 19,
    ProgressPercentage: 100, StartDate: '2025-03-25', DueDate: '2025-04-20',
    CompletedDate: '2025-04-18', FacultyRemarks: 'Clean UI. Add QR code verification.', StudentRemarks: 'React frontend with Web3.js.', IsDeleted: false,
  },
  // Project 5 — Mental Health Chatbot
  {
    TaskId: 16, AllocationID: 5, TaskTitle: 'Fine-tune DialoGPT on Mental Health Dataset',
    TaskDescription: 'Collect counseling conversation corpus and fine-tune DialoGPT-medium.',
    TaskStatus: 3, PriorityID: 1, AssignedScore: 30, EarnedScore: 28,
    ProgressPercentage: 100, StartDate: '2025-02-20', DueDate: '2025-03-30',
    CompletedDate: '2025-03-28', FacultyRemarks: 'Good fine-tuning approach.', StudentRemarks: 'Used PEFT with LoRA for efficiency.', IsDeleted: false,
  },
  {
    TaskId: 17, AllocationID: 5, TaskTitle: 'Safety Guardrails & Crisis Detection',
    TaskDescription: 'Implement content moderation and escalation logic for crisis keywords.',
    TaskStatus: 3, PriorityID: 1, AssignedScore: 25, EarnedScore: 23,
    ProgressPercentage: 100, StartDate: '2025-03-30', DueDate: '2025-04-30',
    CompletedDate: '2025-04-28', FacultyRemarks: 'Critical feature. Well implemented.', StudentRemarks: 'Tested against 50 edge cases.', IsDeleted: false,
  },
  {
    TaskId: 18, AllocationID: 5, TaskTitle: 'Chat Interface Development',
    TaskDescription: 'Build a calming, accessible chat UI with mood tracking widgets.',
    TaskStatus: 2, PriorityID: 2, AssignedScore: 20, EarnedScore: 0,
    ProgressPercentage: 55, StartDate: '2025-04-30', DueDate: '2025-06-15',
    CompletedDate: null, FacultyRemarks: '', StudentRemarks: 'Working on mood journal feature.', IsDeleted: false,
  },
  {
    TaskId: 19, AllocationID: 5, TaskTitle: 'Clinical Evaluation & Ethics Review',
    TaskDescription: 'Conduct evaluation with mental health professionals and IRB ethics submission.',
    TaskStatus: 1, PriorityID: 1, AssignedScore: 25, EarnedScore: 0,
    ProgressPercentage: 0, StartDate: '2025-06-15', DueDate: '2025-07-25',
    CompletedDate: null, FacultyRemarks: '', StudentRemarks: '', IsDeleted: false,
  },
];

// ── Helper functions ───────────────────────────────────────
export const getProjectsByFaculty = (facultyId) =>
  mockProjects.filter(p => p.FacultyId === facultyId && !p.IsDeleted);

export const getProjectsByStudent = (studentId) =>
  mockProjects.filter(p => p.StudentId === studentId && !p.IsDeleted);

export const getTasksByProject = (allocationId) =>
  mockTasks.filter(t => t.AllocationID === allocationId && !t.IsDeleted);

export const getUserById = (userId) =>
  mockUsers.find(u => u.UserId === userId) || null;

export const getRolesByUserId = (userId) => {
  const roleIds = mockUserRoles.filter(ur => ur.UserId === userId).map(ur => ur.RoleId);
  return mockRoles.filter(r => roleIds.includes(r.RoleId));
};

export const getPrimaryRoleByUserId = (userId) => {
  const ur = mockUserRoles.find(u => u.UserId === userId);
  if (!ur) return null;
  return mockRoles.find(r => r.RoleId === ur.RoleId) || null;
};

export const getStatusById = (id) => mockStatuses.find(s => s.StatusID === id);
export const getPriorityById = (id) => mockPriorities.find(p => p.PriorityID === id);

// Next IDs (for mock CRUD)
export const getNextId = (arr, key) => Math.max(0, ...arr.map(i => i[key])) + 1;
